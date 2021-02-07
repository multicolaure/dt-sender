import { EmailConfiguration } from "./model";

export const BASE_URL = process.env.VUE_APP_API_BASE_URL;


export function preview(file: any) {
  const formData = new FormData();
  formData.append('attachment', file);

  return fetch(BASE_URL + '/prepare', {
    method: 'POST',
    body: formData,
    
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
    });
}

export function send(file: any, emailConfig: EmailConfiguration) {

  const formData = new FormData();
  formData.append('attachment', file);
  formData.append('email', emailConfig.email);
  formData.append('emailBody', emailConfig.message);

  return fetch(BASE_URL + '/send', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
    });

}


export function fetchPreferredConfig(): EmailConfiguration {
  return ['email', 'message']
    .reduce((obj: any, currentKey: string): any => ({
      ...obj,
      [currentKey]: localStorage.getItem(currentKey) ?? '',
    }), {});
}

export function savePreferredConfig(config: EmailConfiguration) {
  Object.entries(config).forEach(([key, value]: [string, string]) => {
    localStorage.setItem(key, value);
  });
}

export function getDefaultEmailBody(dtCode: string) {
  return `Bonjour,

Veuillez trouver en pièce jointe la demande de DT ${dtCode}.

Bien cordialement.`;
}