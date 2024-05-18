import { ChangeEvent, useState } from 'react';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import Select from 'react-select';
import { Button } from '@nextui-org/react';

const Export = ({ handleExport }: { handleExport: () => any }) => {
  const [fileName, setFileName] = useState('chat-session');
  const [fileType, setFileType] = useState('txt');

  const fileTypes = [
    { value: 'txt', label: 'Text (.txt)' },
    { value: 'json', label: 'JSON (.json)' },
    { value: 'pdf', label: 'PDF (.pdf)' },
  ];

  const customStyles = {
    control: (styles: any) => ({
      ...styles,
      backgroundColor: 'white',
      borderColor: '#d1d5db',
      borderRadius: '0.375rem',
      padding: '0.5rem',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#a1a1aa',
      },
    }),
    option: (styles: any, { isFocused, isSelected }: any) => ({
      ...styles,
      backgroundColor: isFocused ? '#fde68a' : isSelected ? '#facc15' : undefined,
      color: '#374151',
      cursor: 'pointer',
    }),
  };

  const handleFileNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };

  const handleFileTypeChange = (selectedOption: any) => {
    setFileType(selectedOption.value);
  };

  const handleExportClick = () => {
    const chatSession = handleExport();

    let fileData;
    let fileBlob;
    switch (fileType) {
      case 'txt':
        fileData = chatSession.messages
          .map(([userMessage, assistantResponse]: [string, string]) => `User: ${userMessage}\nAssistant: ${assistantResponse}`)
          .join('\n\n');
        fileBlob = new Blob([fileData], { type: 'text/plain;charset=utf-8' });
        break;
      case 'json':
        fileData = JSON.stringify(chatSession, null, 2);
        fileBlob = new Blob([fileData], { type: 'application/json;charset=utf-8' });
        break;
      case 'pdf':
        const pdf = new jsPDF();

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');

        let y = 10;
        const lineHeight = 7;
        const margin = 10;
        for (const [userMessage, assistantResponse] of chatSession.messages) {
          const lines = pdf.splitTextToSize(`User: ${userMessage}\nAssistant: ${assistantResponse}`, pdf.internal.pageSize.width - 2 * margin);

          pdf.text(lines, margin, y);
          y += lines.length * lineHeight;

          y += lineHeight;
        }

        fileBlob = pdf.output('blob');
        break;
      default:
        console.error('Invalid file type');
        return;
    }

    if (fileBlob) {
      saveAs(fileBlob, `${fileName}.${fileType}`);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center gap-4 max-w-xl mx-auto p-6 border border-gray-200 rounded-lg shadow-lg transition transform hover:scale-105 sm:max-w-md sm:p-4'>
      <label className='text-lg font-semibold' htmlFor='file-name'>
        Export as:
      </label>
      <input
        id='file-name'
        type='text'
        className='w-full p-2 border border-gray-300 rounded-md'
        value={fileName}
        onChange={handleFileNameChange}
        placeholder='Enter file name...'
      />
      <Select
        className='w-full'
        styles={customStyles}
        options={fileTypes}
        value={fileTypes.find((option) => option.value === fileType)}
        onChange={handleFileTypeChange}
      />
      <Button
				variant='shadow'
        color='primary'
        className='w-full mt-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-gradient-to-r hover:from-yellow-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-75'
        onClick={handleExportClick}
      >
        Export
      </Button>
    </div>
  );
};

export { Export };