export const API_URL =
  'http://desafioonline.webmotors.com.br/api/OnlineChallenge/';

export function MODEL_GET(id) {
  return {
    url:
      'http://desafioonline.webmotors.com.br/api/OnlineChallenge/Model?MakeID=' +
      id,
    options: {
      method: 'GET',
    },
  };
}

export function VERSION_GET(id) {
  return {
    url:
      'http://desafioonline.webmotors.com.br/api/OnlineChallenge/Version?ModelID=' +
      id,
    options: {
      method: 'GET',
    },
  };
}

export const ALL_VEHICLES = async () => {
  let lista = [];
  let atual = [];
  let index = 0;
  let filtrados = [];
  do {
    index++;
    const response = await fetch(
      'http://desafioonline.webmotors.com.br/api/OnlineChallenge/Vehicles?Page=' +
        index,
    );
    const json = await response.json();
    atual = json;
    // eslint-disable-next-line
    if (atual.length != 0) {
      lista = [...lista, json];
    }
    // eslint-disable-next-line
  } while (atual.length != 0);

  for (let index = 0; index < lista.length; index++) {
    filtrados = filtrados.concat(
      lista[index].filter((array) => {
        return array;
      }),
    );
  }
  return filtrados;
};
