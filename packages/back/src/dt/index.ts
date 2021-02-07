import pdfjs, { PDFDocumentProxy, PDFPromise, TextContentItem } from 'pdfjs-dist';
import { flatten, range } from 'lodash';
import { DtFiles } from '../zip/index';

export interface Operator {
    index: number,
    name: string,
    email: string,
}

type Names = { [index: string]: string };
type Emails = { [name: string]: string };

export function getOperators(buffer: Buffer): Promise<Array<Operator>> {
    var arrayBuffered = new Uint8Array(buffer);

    // @ts-ignore
    return getDocument(arrayBuffered)
    .then(doc => findPageWith(doc, 'Liste des exploitants').then(indexPageNumber => [doc, indexPageNumber] as [PDFDocumentProxy, number]))
    .then(([doc, indexPageNumber]) => Promise.all([
        getOperatorNames(doc, indexPageNumber),
        getOperatorsEmails(doc, indexPageNumber),
    ]))
    .then(([names, emails]) => {
        return Object.entries(names)
            .map(([index, name]) : Operator => ({
                index: parseFloat(index),
                name,
                email: emails[name],
            }))
    });
}

function getOperatorNames(doc: PDFDocumentProxy, indexPageNumber: number): Promise<Names> {

    
    return getPageContent(doc, indexPageNumber)
        .then(content => {
            const starter = 'Société';
            const starterIndex = content.findIndex((item) => item.str === starter);

            return content.slice(starterIndex + 1);
        })
        .then(content => content.map(item => item.str))
        .then(content => {
            let lastIndex: number;
            return content.reduce((operatorsByIndex, currentItem) => {
                const index = parseFloat(currentItem);
                if(!isNaN(index)) {
                    lastIndex = index;
                }
                else {
                    return {
                        ...operatorsByIndex,
                        [lastIndex]: currentItem
                    }
                }
                return operatorsByIndex;
            }, {});
        });
    
}

function getOperatorsEmails(doc: PDFDocumentProxy, indexPageNumber: number): Promise<Emails> {

    const numbPages = doc.numPages;

    const pageContentPromises = range(indexPageNumber+1, numbPages)
        .map(page => getPageContent(doc, page)
            .then(content => content.map(item => item.str)));

    return Promise.all(pageContentPromises)
        .then(contents => flatten(contents))
        .then(contents => {
            let currentName: string = '';
            let nextNameIndex = -1;
            let currentEmail: string | undefined;
            let nextEmailIndex = -1;

            return contents.reduce((operatorEmails, item, index, all) => {
                if(item === 'Société :') {
                    nextNameIndex = index + 1;
                    currentName = '';
                }
                if(item === 'Contact :') {
                    nextNameIndex = -1;
                }
                if(nextNameIndex === index) {
                    nextNameIndex++;
                    currentName = currentName + item;
                }
                if(item === 'Courriel :') {
                    nextEmailIndex = index + 1;
                    currentEmail = undefined;
                }
                if(nextEmailIndex === index && currentName) {
                    nextEmailIndex = -1;
                    currentEmail = item;
                }
                if(currentEmail && currentName) {
                    return {
                        ...operatorEmails,
                        [currentName]: currentEmail,
                    }
                }
                return operatorEmails;
            }, {});
        });
    
}

export function getDtCode(dtFiles: DtFiles) {
    return dtFiles.groundCoverage.filename.replace('_DT_emprise.pdf', '');
}


function getDocument(filePath: string): Promise<PDFDocumentProxy> {
    return toPromise(pdfjs.getDocument(filePath).promise);
}

function getPageContent(doc: PDFDocumentProxy, page: number): Promise<Array<TextContentItem>> {
    return toPromise(doc.getPage(page))
        .then((page) => toPromise(page.getTextContent()))
        .then(content => content.items);
}

async function findPageWith(doc: PDFDocumentProxy, search: string): Promise<number> {
    return findAsync(range(1, doc.numPages), (pageNumber) => {
        return getPageContent(doc, pageNumber)
        .then((content) => {
            return content.findIndex((textContentItem: TextContentItem) => textContentItem.str.includes(search)) >= 0;
        });
    })
    .then(pageNumber => {
        if(!pageNumber) {
            throw new Error('Could not find' + search);
        }
        return pageNumber;
    });
}

function toPromise<T>(promise: PDFPromise<T>) : Promise<T> {
    return new Promise((resolve, reject) => promise
    .then((data) => resolve(data),
        (error) => reject(error)));
}

async function findAsync<T>(
    array: T[],
    predicate: (t: T) => Promise<boolean>,
  ): Promise<T | undefined> {
    for (const t of array) {
      if (await predicate(t)) {
        return t;
      }
    }
    return undefined;
  }
  