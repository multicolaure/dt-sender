
import unzip, { Entry } from 'unzipper';
import https from 'https';
import path from 'path';

export interface DtFiles {
  groundCoverage: DtFile,
  summary: DtFile,
  description: DtFile,
  operators: Array<DtFile>
}

export interface DtFile {
  filename: string,
  content: Buffer,
}

export function extractFileNames(zipUrl: string): Promise<DtFiles> {
    
    return new Promise((resolve, reject) => {
    
        let groundCoverage: DtFile;
        let summary: DtFile;
        let description: DtFile;
        let operators: Array<DtFile> = [];

        const getFromEntry = async (entry: Entry): Promise<DtFile> => {
          return {
            filename: path.basename(entry.path),
            content: await entry.buffer(),
          }
        }
    
        https.get(zipUrl, (response) => {
          response
          .pipe(unzip.Parse())
          .on('entry', async function (entry: Entry) {
            
            const filePath: string = entry.path;

            if(filePath.endsWith('emprise.pdf')) {
              groundCoverage = await getFromEntry(entry);
            }
            else if(filePath.endsWith('resume.pdf')) {
              summary = await getFromEntry(entry);
            }
            else if(filePath.endsWith('description.xml') && !filePath.includes('Signature')) {
              description = await getFromEntry(entry);
            }
            else if(filePath.match(/DT_[0-9]*.pdf$/)) {
              const index = filePath.match(/DT_([0-9]*).pdf$/)![1];
              operators[parseFloat(index)] = await getFromEntry(entry);
            }
            entry.autodrain();
          })
          .on('finish', function () {
            resolve({
              groundCoverage,
              summary,
              description,
              operators
            });
          })
          .on('error', function (error: Error) {
              reject(error);
          });
        });
        
    });
}
