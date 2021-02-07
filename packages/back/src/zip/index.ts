import AdmZip from 'adm-zip';

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


function getFileFromEntry(entry: AdmZip.IZipEntry): Promise<DtFile> {
  return new Promise((resolve) => {
    entry.getDataAsync((data: Buffer) => {
      resolve({
        filename: entry.name,
        content: data,
      });
    });
  });
}

export async function extractFileNames(zip: string | Buffer): Promise<DtFiles> {

  let groundCoverage: DtFile;
  let summary: DtFile;
  let description: DtFile;
  let operators: Array<DtFile> = [];

  return Promise.all(new AdmZip(zip).getEntries()
    .map(async entry => {
      const filePath: string = entry.entryName;

        if (filePath.endsWith('emprise.pdf')) {
          groundCoverage = await getFileFromEntry(entry);
        }
        else if (filePath.endsWith('resume.pdf')) {
          summary = await getFileFromEntry(entry);
        }
        else if (filePath.endsWith('DT_description.zip')) {
          const filesFromSubzip = await extractFileNames(entry.getData());
          description = filesFromSubzip.description;
        }
        else if (filePath.endsWith('DT_description.xml') && !filePath.startsWith('Signature')) {
          description = await getFileFromEntry(entry);
        }
        else if (filePath.match(/DT_[0-9]*.pdf$/)) {
          const index = filePath.match(/DT_([0-9]*).pdf$/)![1];
          operators[parseFloat(index)] = await getFileFromEntry(entry);
        }
    }))
    .then(() => {
      return {
        groundCoverage,
        summary,
        description,
        operators
      };
    });
}
