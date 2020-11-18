const pdf = require('pdfjs');
const fs = require('fs');
const { v4: generateToken } = require('uuid');

module.exports.generateCertificate = async (transportation) => {
  await transportation.populate('clientId').populate('transporterId').populate('providerId').execPopulate();
  const transporter = transportation.transporterId;
  const provider = transportation.providerId;
  const client = transportation.clientId;

  const doc = new pdf.Document({
    font: require('pdfjs/font/Helvetica'),
    padding: 10
  });
  const path = `../../certificates/${generateToken()}.pdf`;
  doc.pipe(fs.createWriteStream(path));
  
  doc.text('CERTIFICATE\n\n', { fontSize: 16, textAlign: 'center' });
  doc.text(`Certificate id ${transportation._id} issued to ${transporter.companyName} at ${transportation.transportationEndTime} proving that goods were transported to ${client.companyName} in a temperature that meets official quality requirements. Goods provided by ${provider.companyName}.`);

  await doc.end()
  return path;
}