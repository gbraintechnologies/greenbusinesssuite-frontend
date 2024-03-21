import { useState } from 'react';
import Papa from 'papaparse';

type FileType = 'csv' | 'xls' | 'xlsx';

interface FileData {
    isFileLoaded: boolean;
    fileData: any[] | null;
    loadFile: (file: File) => void;
}

const useFileImport = (): FileData => {
    const [isFileLoaded, setIsFileLoaded] = useState<boolean>(false);
    const [fileData, setFileData] = useState<any[] | null>(null);

    const loadFile = (file: File) => {
        const fileType: FileType = file.name.split('.').pop()?.toLowerCase() as FileType;

        if (fileType === 'csv') {
            Papa.parse(file, {
                complete: result => {
                    console.log('CSV data:', result.data);
                    setFileData(result.data);
                    setIsFileLoaded(true);
                },
                error: error => {
                    console.error('CSV parsing error:', error);
                },
            });
        } else if (fileType === 'xls' || fileType === 'xlsx') {
            // const reader = new FileReader();
            // reader.onload = event => {
            //     const binaryString = event.target?.result as string;
            //     const workbook = XLSX.read(binaryString, { type: 'binary' });
            //     const sheetName = workbook.SheetNames[0];
            //     const sheet = workbook.Sheets[sheetName];
            //     const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            //     console.log('XLSX data:', jsonData);
            //     setFileData(jsonData);
            //     setIsFileLoaded(true);
            };
        //     reader.readAsBinaryString(file);
        // } else {
        //     console.error('Unsupported file type');
        // }
    };

    return {
        isFileLoaded,
        fileData,
        loadFile,
    };
};

export default useFileImport;