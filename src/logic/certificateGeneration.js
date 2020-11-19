const pdf = require('pdfjs');
const fs = require('fs');
const { v4: generateToken } = require('uuid');
const path = require('path');

module.exports.generateCertificate = async (transportation) => {
  await transportation.populate('clientId').populate('transporterId').populate('providerId').execPopulate();
  const transporter = transportation.transporterId;
  const provider = transportation.providerId;
  const client = transportation.clientId;

  const doc = new pdf.Document({
    font: require('pdfjs/font/Helvetica'),
    padding: 10
  });
  const certName = `${generateToken()}.pdf`
  const certPath = path.join(__dirname, `../../certificates/${certName}`);
  doc.pipe(fs.createWriteStream(certPath));
  
  doc.text('CERTIFICATE\n\n', { fontSize: 16, textAlign: 'center' });
  doc.text(`Certificate id ${transportation._id} at ${transportation.transportationEndTime} proving that goods were transported by ${transporter.firstName} ${transporter.lastName} in a temperature that meets official quality requirements.`);

  await doc.end()
  return certName;
}