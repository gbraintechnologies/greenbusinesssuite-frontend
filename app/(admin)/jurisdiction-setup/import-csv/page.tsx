'use client'
import React from "react";
import useFileImport from '../components/UseFileImport';

function ImportCsv() {
    const { isFileLoaded, fileData, loadFile } = useFileImport();

    const handleFileChange = (files: FileList | null) => {
        if (files && files.length > 0) {
            loadFile(files[0]);
        }
    };



    return (
        <div  style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
            padding: '20px',
            borderRadius: '8px', // Adding border radius to the container
            backgroundColor: '#ffffff',
            maxWidth: '400px',
        }}>
            <div>
            <h6 className="font-bold text-xl mb-10">Import File</h6>
                <input type="file" accept=".csv, .xls, .xlsx" onChange={e => handleFileChange(e.target.files)} />
                {isFileLoaded ? <label>File Loaded</label> : <label></label>}
                {fileData && (
                    <div>
                        <h2>File Data</h2>
                        <pre>{JSON.stringify(fileData, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImportCsv;