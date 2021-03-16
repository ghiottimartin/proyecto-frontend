import React from 'react';

//Actions
import { fetchUsuarioLogueadoIfNeeded } from "./actions/UsuarioActions";

//Constants
import * as rutas from './constants/rutas.js';

//Components
import Navegador from "./components/elementos/Navegador";
import Inicio from "./components/secciones/Inicio";
import Login from "./components/secciones/Login";
import Registro from "./components/secciones/Registro";
import CambiarPassword from "./components/secciones/CambiarPassword";
import ValidarEmail from "./components/secciones/ValidarEmail";
import NotFound from "./components/secciones/NotFound";
import MenuAlta from "./components/secciones/MenuAlta"

//Redux
import {connect} from 'react-redux';

//Router
import { withRouter } from "react-router-dom";
import { Route, Switch } from "react-router";

function App() {
  return (
      <div className="app">
          <Navegador />
          <div className="contenedor">
              <Switch>
                  <Route exact path={rutas.INICIO} component={Inicio} />
                  <Route exact path={rutas.LOGIN} component={Login} />
                  <Route exact path={rutas.ALTA_MENU} component={MenuAlta} />
                  <Route exact path={rutas.REGISTRO} component={Registro} />
                  <Route exact path={rutas.RESET_PASSWORD} component={CambiarPassword} />
                  <Route exact path={rutas.VALIDAR_EMAIL} component={ValidarEmail} />
                  <Route exact path="*" component={NotFound} />
              </Switch>
          </div>
      </div>

  );
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUsuarioLogueadoIfNeeded: () => {
            dispatch(fetchUsuarioLogueadoIfNeeded())
        },
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
