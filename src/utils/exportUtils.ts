import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Patient } from '../types';
import { format } from 'date-fns';

// Extend the jsPDF interface to include autoTable for TypeScript
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export const generatePdfReport = (patients: Patient[]) => {
  const doc = new jsPDF() as jsPDFWithAutoTable;

  // Add header
  doc.setFontSize(18);
  doc.text('MediCode Validator - Patient Report', 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Report generated on: ${format(new Date(), 'MMMM dd, yyyy')}`, 14, 30);

  // Define table columns and rows
  const tableColumn = ["Patient ID", "Name", "Age", "Gender", "Last Visit"];
  const tableRows: any[][] = [];

  patients.forEach(patient => {
    const patientData = [
      patient.patientId,
      patient.name,
      patient.age,
      patient.gender,
      format(new Date(patient.lastVisit), 'yyyy-MM-dd'),
    ];
    tableRows.push(patientData);
  });

  // Add table using jspdf-autotable
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] }, // medical-blue-600
  });

  // Add footer with page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10, { align: 'center' });
  }

  // Save the PDF, which triggers a download in the browser
  doc.save('medicode_patient_report.pdf');
};
