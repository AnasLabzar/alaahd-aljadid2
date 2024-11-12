import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const generateInvoicePDF = (invoiceData: any) => {
    const { invoiceRef, customerId, adminId, items, totals, type, orderDate, dueDate } = invoiceData;

    console.log("hello00000");
    

    // Define the document content
    const docDefinition = {
        content: [
            // Header
            {
                text: 'Invoice',
                style: 'header'
            },
            { text: `Invoice Reference: ${invoiceRef}`, style: 'subheader' },
            { text: `Date: ${orderDate}`, style: 'subheader' },
            { text: `Due Date: ${dueDate}`, style: 'subheader' },
            
            // Customer and Admin Information
            { text: `Customer ID: ${customerId}`, style: 'info' },
            { text: `Admin ID: ${adminId}`, style: 'info' },
            
            // Invoice Items Table
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '*', 'auto', 'auto', 'auto'],
                    body: [
                        [
                            { text: 'Product', style: 'tableHeader' },
                            { text: 'Description', style: 'tableHeader' },
                            { text: 'Quantity', style: 'tableHeader' },
                            { text: 'Unit Price', style: 'tableHeader' },
                            { text: 'Total', style: 'tableHeader' }
                        ],
                        ...items.map((item: any) => [
                            item.title,
                            item.description,
                            item.quantity,
                            item.price.toFixed(2),
                            (item.quantity * item.price).toFixed(2)
                        ])
                    ]
                },
                layout: 'lightHorizontalLines'
            },

            // Totals
            {
                style: 'totals',
                table: {
                    widths: ['*', 'auto'],
                    body: [
                        [{ text: 'Subtotal', alignment: 'right' }, totals.subtotal],
                        [{ text: 'Tax', alignment: 'right' }, totals.taxAmount],
                        [{ text: 'Promotion Discount', alignment: 'right' }, totals.promotionAmount],
                        [{ text: 'Transport Cost', alignment: 'right' }, totals.transportPrice],
                        [{ text: 'Total', alignment: 'right', bold: true }, totals.total]
                    ]
                }
            },
            
            // Footer
            { text: 'Thank you for your business!', style: 'footer' }
        ],
        styles: {
            header: { fontSize: 24, bold: true, margin: [0, 0, 0, 10] },
            subheader: { fontSize: 16, margin: [0, 5, 0, 5] },
            info: { fontSize: 12, margin: [0, 2, 0, 2] },
            tableHeader: { bold: true, fontSize: 13, color: 'black' },
            totals: { margin: [0, 10, 0, 10] },
            footer: { fontSize: 12, alignment: 'center', margin: [0, 20, 0, 0] }
        }
    };

    // Open PDF in a new window
    pdfMake.createPdf(docDefinition).open();
};
