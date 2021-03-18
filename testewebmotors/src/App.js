import React from 'react';
import { MODEL_GET, VERSION_GET, ALL_VEHICLES } from './api.js';
import logo from './img/logo.png';
import moto from './img/moto.png';
import carLogo from './img/car.png';
import styles from './components/App.module.css';
import Select from './components/form/Select.js';
import Checkbox from './components/form/Checkbox.js';
import Autocomplete from './components/form/Autocomplete.js';
import './components/autocomplete.css';

const App = () => {
  //Mensagem
  const [mensagem, setMensagem] = React.useState({
    status: false,
    msg: '',
    type: '',
  });
  // loader
  const [loader, setLoader] = React.useState(true);
  // filtro Total
  const [hasFiltroGeral, setHasFiltroGeral] = React.useState(false);
  const [allFiltered, setAllFiltered] = React.useState(null);
  // Raio
  const [raio, setRaio] = React.useState('');
  // marca
  const [marcaList, setMarcaList] = React.useState(null);
  const [marcaId, setMarcaId] = React.useState('');
  // modelo
  const [modeloList, setModeloList] = React.useState(null);
  const [modelonameId, setModelonameId] = React.useState({
    modeloId: '',
    modeloName: '',
  });
  // versao
  const [versaoList, setVersaoList] = React.useState(null);
  const [versaoId, setVersaoId] = React.useState('');
  // Todos os veiculos
  const [allVehicles, setAllVehicles] = React.useState(null);
  // Ano de fabricação
  const [anoFabricacao, setAnoFabricacao] = React.useState('');
  // Faixa de preço
  const [faixaPreco, setFaixaPreco] = React.useState('');
  // checkBox
  const [checkboxNovos, setCheckboxNovos] = React.useState(true);
  const [checkboxUsados, setCheckboxUsados] = React.useState(true);
  // controle das tabs
  const [tabActive, setTabActive] = React.useState(1);

  React.useEffect(async () => {
    setLoader(true);
    fetch(`http://desafioonline.webmotors.com.br/api/OnlineChallenge/Make`)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        return setMarcaList(json);
      });
    setAllVehicles(await ALL_VEHICLES());

    setLoader(false);
  }, []);

  async function populaFiltrados(array) {
    setAllFiltered(array);
    console.log(allFiltered);
  }

  // função para pesquisar os modelos disponiveis
  async function PesquisaModelos(id) {
    setLoader(true);
    setMarcaId(id);
    const modelos = await Promise.all(
      marcaList.map(async ({ ID }) => {
        const { url, options } = MODEL_GET(ID);
        const response = await fetch(url, options);
        const json = await response.json();

        return json;
      }),
    );
    let filtrados = [];
    for (let index = 0; index < modelos.length; index++) {
      filtrados = filtrados.concat(
        modelos[index].filter((array) => {
          return array;
        }),
      );
    }
    setModeloList(filtrados);
    if (id != 0) {
      let filtrados = [];
      for (let index = 0; index < modelos.length; index++) {
        filtrados = filtrados.concat(
          modelos[index].filter((array) => {
            return array.MakeID == id;
          }),
        );
      }

      setModeloList(filtrados);
    }
    setLoader(false);
  }

  // função para pesquisar as versoes disponiveis
  async function PesquisaVersoes(id) {
    debugger;
    setLoader(true);
    setModelonameId({ modeloId: id, modeloName: '' });
    let nameModel = '';
    let versoes1 = await Promise.all(
      modeloList.map(async ({ MakeID, ID, Name }) => {
        const { url, options } = VERSION_GET(MakeID);
        const response = await fetch(url, options);
        const json = await response.json();
        // eslint-disable-next-line
        if (ID == id) {
          nameModel = Name;
          setModelonameId({ modeloName: nameModel });
        }
        return json;
      }),
    );

    let versoes = allVehicles.filter((vehicles) => {
      debugger;
      // eslint-disable-next-line
      if (vehicles.Model == nameModel) {
        return vehicles.Version;
      }
    });
    // eslint-disable-next-line
    if (id != 0) {
      let reduced = [];
      versoes.forEach((item) => {
        var duplicated =
          reduced.findIndex((redItem) => {
            // eslint-disable-next-line
            return item.Version == redItem.Version;
          }) > -1;

        if (!duplicated) {
          reduced.push(item);
        }
      });

      setVersaoList(reduced);
      console.log(versaoList);
    }
    setLoader(false);
  }

  function ativaCarros() {
    setTabActive(1);
    let tabCarros = document.getElementById('tabCarros');
    let tabMotos = document.getElementById('tabMotos');

    if (!tabCarros.classList.contains('selected')) {
      tabCarros.classList.add('selected');
      tabMotos.classList.remove('selected');
    }
  }
  function ativaMotos() {
    setTabActive(2);
    let tabCarros = document.getElementById('tabCarros');
    let tabMotos = document.getElementById('tabMotos');

    if (!tabMotos.classList.contains('selected')) {
      tabMotos.classList.add('selected');
      tabCarros.classList.remove('selected');
    }
  }

  function LimpaFiltros() {
    setAllFiltered(null);
    setHasFiltroGeral(false);
    setMarcaId('');
    setModelonameId({ modeloId: '', modeloName: '' });
    setAnoFabricacao('');
    setFaixaPreco('');
    setVersaoId('');
    setVersaoList(null);
    setModeloList(null);
    setMensagem({
      status: false,
      msg: '',
    });
  }

  async function filtraOfertas(event) {
    event.preventDefault();
    let marca = '';
    let filtroGeral = [];
    filtroGeral = allVehicles;

    switch (parseInt(marcaId)) {
      case 0:
      case '': // todas as marcas
        marca = '';
        break;
      case 1: // abaixo de 10.000
        marca = 'Chevrolet';
        break;
      case 2: // 10.000 - 30.000
        marca = 'Honda';
        break;
      case 3: // 30.000 - 50.000
        marca = 'Ford';
        break;
      default:
        break;
    }
    // eslint-disable-next-line
    if (marca != '') {
      filtroGeral = filtroGeral.filter((e) => {
        // eslint-disable-next-line
        return e.Make == marca;
      });
    }
    // eslint-disable-next-line
    if (modelonameId.modeloName != '') {
      filtroGeral = filtroGeral.filter((e) => {
        // eslint-disable-next-line
        return e.Model == modelonameId.modeloName;
      });
    }

    if (anoFabricacao != '') {
      filtroGeral = filtroGeral.filter((e) => {
        // eslint-disable-next-line
        if (parseInt(anoFabricacao) == 0 || anoFabricacao == '') {
          return e;
        }
        // eslint-disable-next-line
        if (parseInt(anoFabricacao) == 1) {
          return e.YearFab >= 2017;
        }
        // eslint-disable-next-line
        if (parseInt(anoFabricacao) == 2) {
          return e.YearFab >= 2011 && e.YearFab <= 2016;
        }
        // eslint-disable-next-line
        if (parseInt(anoFabricacao) == 3) {
          return e.YearFab >= 2000 && e.YearFab <= 2010;
        }
        // eslint-disable-next-line
        if (parseInt(anoFabricacao) == 4) {
          return e.YearFab >= 1992 && e.YearFab <= 1999;
        }
        // eslint-disable-next-line
        if (parseInt(anoFabricacao) == 5) {
          return e.YearFab <= 1991;
        }
      });
    }
    // eslint-disable-next-line
    if (faixaPreco != '') {
      filtroGeral = filtroGeral.filter((e) => {
        // eslint-disable-next-line
        if (parseInt(faixaPreco) == 0 || faixaPreco == '') {
          return e;
        }
        // eslint-disable-next-line
        if (parseInt(faixaPreco) == 1) {
          return e.Price.split(',')[0] <= 10000;
        }
        // eslint-disable-next-line
        if (parseInt(faixaPreco) == 2) {
          return (
            e.Price.split(',')[0] >= 10000 && e.Price.split(',')[0] <= 30000
          );
        }
        // eslint-disable-next-line
        if (parseInt(faixaPreco) == 3) {
          return (
            e.Price.split(',')[0] >= 30000 && e.Price.split(',')[0] <= 60000
          );
        }
        // eslint-disable-next-line
        if (parseInt(faixaPreco) == 4) {
          return e.Price.split(',')[0] >= 50000;
        }
      });
    }

    if (!checkboxNovos) {
      filtroGeral = filtroGeral.filter((e) => {
        return e.KM > 0;
      });
    }
    if (!checkboxUsados) {
      filtroGeral = filtroGeral.filter((e) => {
        return e.KM == 0;
      });
    }
    // eslint-disable-next-line
    if (versaoId != '' || versaoId != 0) {
      debugger;
      filtroGeral = filtroGeral.filter((e) => {
        // eslint-disable-next-line
        return e.Version == versaoId;
      });
    }
    // eslint-disable-next-line
    if (filtroGeral.length == 0) {
      setMensagem({
        status: true,
        msg: 'Infelizmente nao encontramos nenhum veiculo com estes parametros',
        type: 'error',
      });
      populaFiltrados(filtroGeral);
      setHasFiltroGeral(true);
    } else {
      setMensagem({
        status: true,
        msg:
          'Encontramos ' +
          filtroGeral.length +
          ' veiculos com estes parametros !',
        type: 'success',
      });
      populaFiltrados(filtroGeral);
      setHasFiltroGeral(true);
    }
  }

  return (
    <div className={styles.container}>
      {loader ? (
        <div className="lds-ripple">
          <div className="lds-ripple1"></div>
          <div className="lds-ripple2"></div>
        </div>
      ) : (
        ''
      )}
      <main>
        <header>
          <img className={styles.logo} src={logo} alt="logo" />
        </header>
        <section>
          <div className={styles.tabContainer}>
            <div className={styles.tab}>
              <div
                id="tabCarros"
                className={`${styles.tabSon} selected`}
                onClick={ativaCarros}
              >
                <img
                  src={carLogo}
                  style={{ marginBottom: 0 }}
                  alt="carro"
                ></img>
                <div className={styles.tabSonContainer}>
                  <p>comprar</p>
                  <label htmlFor="">CARROS</label>
                </div>
              </div>
              <div
                className={`${styles.tabSon}`}
                id="tabMotos"
                onClick={ativaMotos}
              >
                <img src={moto} alt="moto"></img>
                <div className={styles.tabSonContainer}>
                  <p>comprar</p>
                  <label htmlFor="">MOTOS</label>
                </div>
              </div>
            </div>
            <div className={styles.tabSonContainerButton}>
              <button>vender meu carro</button>
            </div>
          </div>
        </section>
        <section>
          {tabActive == 1 ? (
            <div className={styles.containerInterno}>
              <div className={styles.checkboxGroupContainer}>
                <div className={styles.checkboxContainer}>
                  <Checkbox
                    value={checkboxNovos}
                    setValue={setCheckboxNovos}
                    name="Novos"
                  />
                </div>
                <div className={styles.checkboxContainer}>
                  <Checkbox
                    value={checkboxUsados}
                    setValue={setCheckboxUsados}
                    name="Usados"
                  />
                </div>
              </div>
              <form onSubmit={filtraOfertas}>
                <div className={styles.flexContainer}>
                  <div className={styles.flexRow}>
                    <div
                      className={`${styles.flex2} ${styles.inpSelecContainer}`}
                    >
                      <Autocomplete
                        suggestions={[
                          'Acre',
                          'Alagoas',
                          'Amapá',
                          'Amazonas',
                          'Bahia',
                          'Ceará',
                          'Distrito Federal',
                          'Espírito Santo',
                          'Goiás',
                          'Maranhão',
                          'Mato Grosso',
                          'Mato Grosso do Sul',
                          'Minas Gerais',
                          'Pará',
                          'Paraíba',
                          'Paraná',
                          'Pernambuco',
                          'Piauí',
                          'Rio de Janeiro',
                          'Rio Grande do Norte',
                          'Rio Grande do Sul',
                          'Rondônia',
                          'Roraima',
                          'Santa Catarina',
                          'Sao Paulo',
                          'Sergipe',
                          'Tocantins',
                        ]}
                      />
                      <Select
                        options={[
                          { ID: 0, Name: 'todos' },
                          { ID: 1, Name: 'menos de 5KM' },
                          { ID: 2, Name: '20KM' },
                          { ID: 3, Name: '30KM' },
                          { ID: 4, Name: '50KM' },
                          { ID: 5, Name: 'acima de 100KM' },
                        ]}
                        value={raio}
                        setValue={setRaio}
                        selectName="Raio da busca"
                      />
                    </div>
                    <div className={styles.flex1}>
                      {marcaList != null ? (
                        <Select
                          required
                          options={marcaList}
                          value={marcaId}
                          setValue={PesquisaModelos}
                          selectName="Selecione a marca"
                          all
                        />
                      ) : (
                        <Select
                          value=""
                          options={[]}
                          selectName="Selecione a marca"
                        />
                      )}
                    </div>
                    <div className={styles.flex1}>
                      {modeloList != null ? (
                        <Select
                          options={modeloList}
                          value={modelonameId.modeloI}
                          setValue={PesquisaVersoes}
                          selectName="Selecione o modelo"
                          all
                        />
                      ) : (
                        <Select
                          value=""
                          options={[]}
                          selectName="Selecione o modelo"
                        />
                      )}
                    </div>
                  </div>
                  <div className={styles.flexRow}>
                    <div className={styles.flex1}>
                      <Select
                        options={[
                          { ID: 0, Name: 'todos' },
                          { ID: 1, Name: 'acima de 2017' },
                          { ID: 2, Name: '2011-2016' },
                          { ID: 3, Name: '2000 - 2010' },
                          { ID: 4, Name: '1992 - 1999' },
                          { ID: 5, Name: 'abaixo de 1991' },
                        ]}
                        value={anoFabricacao}
                        setValue={setAnoFabricacao}
                        selectName="Ano de fabricação"
                      />
                    </div>
                    <div className={styles.flex1}>
                      <Select
                        options={[
                          { ID: 0, Name: 'todos' },
                          { ID: 1, Name: 'abaixo de 10.000$' },
                          { ID: 2, Name: '10.000$ - 30.000$' },
                          { ID: 3, Name: '30.000$ - 60.000$' },
                          { ID: 4, Name: 'acima de 50.000$' },
                        ]}
                        value={faixaPreco}
                        setValue={setFaixaPreco}
                        selectName="Faixa de preço"
                      />
                    </div>
                    <div className={styles.flex3}>
                      <select
                        value={versaoId}
                        onChange={({ target }) => setVersaoId(target.value)}
                      >
                        <option value="">Selecione a versão</option>
                        <option key="versao_0" value="0">
                          todas
                        </option>
                        {versaoList != null
                          ? versaoList.map((e) => (
                              <option key={e.ID} value={e.Version}>
                                {e.Version}
                              </option>
                            ))
                          : ''}
                      </select>
                    </div>
                  </div>

                  <div className={`${styles.dFlex} ${styles.rowButtons}`}>
                    <div
                      className={`${styles.flex3} ${styles.dFlexAlgnCenter}`}
                    >
                      <a className={styles.btnBuscaAvancada} href="/#">
                        Busca avançada
                      </a>
                    </div>
                    <div
                      className={`${styles.flex1} ${styles.dFlexAlgnCenter}`}
                    >
                      <a
                        className={styles.btnfiltro}
                        onClick={LimpaFiltros}
                        href="/#"
                      >
                        Limpar filtros
                      </a>
                    </div>
                    <div className={`${styles.flex2}`}>
                      <button type="submit" className={styles.btnVerOfertas}>
                        Ver ofertas
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className={styles.containerInterno}>
              <div className={styles.msgMotos}>
                <label>Não há motos cadastradas no sistema atualmente</label>
              </div>
            </div>
          )}
        </section>
      </main>

      {mensagem.status && hasFiltroGeral ? (
        <section>
          <div
            className={`${styles.msg}`}
            style={
              // eslint-disable-next-line
              mensagem.type == 'success'
                ? { color: 'green', border: '1px solid green' }
                : { color: 'red', border: '1px solid red' }
            }
          >
            <label>{mensagem.msg}</label>
          </div>
        </section>
      ) : (
        ''
      )}

      {allFiltered != null
        ? allFiltered.map((e) => (
            <div
              key={e.ID}
              className={`${styles.containerProduct} ${styles.dFlex}`}
            >
              <div className={`${styles.flex2}`}>
                <img src={e.Image} alt="" />
              </div>
              <div className={`${styles.flex2}`}>
                <ul>
                  <li>
                    <label>Marca:</label>
                    <label>{e.Make}</label>
                  </li>
                </ul>
                <ul>
                  <li>
                    <label>Modelo: </label>
                    <label> {e.Model}</label>
                  </li>
                </ul>
                <ul>
                  <li>
                    <label> Versão: </label>
                    <label> {e.Version}</label>
                  </li>
                </ul>
                <ul>
                  <li>
                    <label>KM rodado: </label>
                    <label> {e.KM}</label>
                  </li>
                </ul>
                <ul>
                  <li>
                    <label>Preço: </label>
                    <label>{e.Price} </label>
                  </li>
                </ul>
                <ul>
                  <li>
                    <label>Ano do modelo: </label>
                    <label> {e.YearModel}</label>
                  </li>
                </ul>
                <ul>
                  <li>
                    <label>Ano de fabricação: </label>
                    <label> {e.YearFab}</label>
                  </li>
                </ul>
                <ul>
                  <li>
                    <label>Cor: </label>
                    <label>{e.Color} </label>
                  </li>
                </ul>
              </div>
            </div>
          ))
        : ''}
    </div>
  );
};

export default App;
