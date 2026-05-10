import fs from 'fs-extra';
import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';

const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/photoslibrary.readonly'
];

const auth = await authenticate({
  keyfilePath: './credentials.json',
  scopes: SCOPES
});

const drive = google.drive({
  version: 'v3',
  auth
});

const DRIVE_FOLDER_ID = '1XVIzNG-h1i10TBPRepIyFJ_n9EGvd9K0';

async function createPhotosJson() {

  console.log('Obteniendo archivos de Drive...');

  const response = await drive.files.list({
    q: `'${DRIVE_FOLDER_ID}' in parents and mimeType contains 'image/'`,
    fields: 'files(id,name,createdTime)'
  });

  const files = response.data.files || [];

  const photos = files.map(file => ({
    name: file.name,
    url: `https://drive.google.com/uc?id=${file.id}`,
    date: file.createdTime,
    title: file.name,
    text: 'Recuerdo de Copito 🤍'
  }));

  fs.writeJsonSync(
    '../photos.json',
    photos,
    { spaces: 2 }
  );

  console.log('photos.json creado correctamente');
}

createPhotosJson();