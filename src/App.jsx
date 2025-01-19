import React from 'react';
import { Helmet } from 'react-helmet';

import { useIntl } from '@edx/frontend-platform/i18n';
import { logError } from '@edx/frontend-platform/logging';
import { initializeHotjar } from '@edx/frontend-enterprise-hotjar';

import { ErrorPage, AppContext } from '@edx/frontend-platform/react';
import FooterSlot from '@openedx/frontend-slot-footer';
import { Alert } from '@openedx/paragon';

import { RequestKeys } from 'data/constants/requests';
import store from 'data/store';
import {
  selectors,
  actions,
} from 'data/redux';
import { reduxHooks } from 'hooks';
import Dashboard from 'containers/Dashboard';

import track from 'tracking';

import fakeData from 'data/services/lms/fakeData/courses';

import AppWrapper from 'containers/WidgetContainers/AppWrapper';
import LearnerDashboardHeader from 'containers/LearnerDashboardHeader';

import { getConfig } from '@edx/frontend-platform';
import messages from './messages';
import './App.scss';

export const App = () => {
  const { authenticatedUser } = React.useContext(AppContext);
  const { formatMessage } = useIntl();
  const isFailed = {
    initialize: reduxHooks.useRequestIsFailed(RequestKeys.initialize),
    refreshList: reduxHooks.useRequestIsFailed(RequestKeys.refreshList),
  };
  const hasNetworkFailure = isFailed.initialize || isFailed.refreshList;
  const { supportEmail } = reduxHooks.usePlatformSettingsData();
  const loadData = reduxHooks.useLoadData();

  React.useEffect(() => {
    if (authenticatedUser?.administrator || getConfig().NODE_ENV === 'development') {
      window.loadEmptyData = () => {
        loadData({ ...fakeData.globalData, courses: [] });
      };
      window.loadMockData = () => {
        loadData({
          ...fakeData.globalData,
          courses: [
            ...fakeData.courseRunData,
            ...fakeData.entitlementData,
          ],
        });
      };
      window.store = store;
      window.selectors = selectors;
      window.actions = actions;
      window.track = track;
    }
    if (getConfig().HOTJAR_APP_ID) {
      try {
        initializeHotjar({
          hotjarId: getConfig().HOTJAR_APP_ID,
          hotjarVersion: getConfig().HOTJAR_VERSION,
          hotjarDebug: !!getConfig().HOTJAR_DEBUG,
        });
      } catch (error) {
        logError(error);
      }
    }
  }, [authenticatedUser, loadData]);
  return (
    <>
      <Helmet>
        <title>{formatMessage(messages.pageTitle)}</title>
        <link rel="shortcut icon" href={getConfig().FAVICON_URL} type="image/x-icon" />
      </Helmet>
      <div>
        <AppWrapper>
          <LearnerDashboardHeader />
          <main>
            {hasNetworkFailure
              ? (
                <Alert variant="danger">
                  <ErrorPage message={formatMessage(messages.errorMessage, { supportEmail })} />
                </Alert>
              ) : (
                <Dashboard />
              )}
          </main>
        </AppWrapper>
        <footer>
          <div className="wrapper wrapper-footer">
            <footer id="footer" className="tutor-container">
              <div className="footer-top">
                <div className="powered-area">
                  <img src="https://dev.mexicox.gob.mx//static/mexicoxmx/images/logo.abajo.b14ec50833e6.png" alt="Runs on Tutor" height="70px"/>
                  <ul className="logo-list">
                    <li>
                      <a href="https://aprende.gob.mx" rel="noopener" target="_blank">

                      </a>
                    </li>

                  </ul>
                </div>

                <nav className="nav-colophon" aria-label="About">
                  <ol>

                    <li>
                      <a href="https://mexicox.gob.mx/about">Sobre el proyecto</a>
                    </li>

                    <li>
                      <a href="https://mail.mexicox.gob.mx/lists/?p=subscribe">Boletín informativo</a>
                    </li>

                    <li>
                      <a href="https://mexicox.gob.mx/honor">Código de honor</a>
                    </li>

                    <li>
                      <a href="https://mexicox.gob.mx/tos">Aviso de privacidad</a>
                    </li>

                    <li>
                      <a href="https://mexicox.gob.mx/help">Preguntas frecuentes</a>
                    </li>

                    <li>
                      <a href="https://mexicox.gob.mx/contact">Contacto</a>
                    </li>

                    <li>
                      <a href="https://soporte.mexicox.gob.mx">Soporte</a>
                    </li>

                  </ol>
                </nav>

              </div>
              <span className="copyright-site">©2025. Todos los derechos reservados.</span>
              <div className="colophon">



              </div>
              <div className="references">
                <!--span>Built on <a href="http://open.edx.org">OpenEdX</a>.</span-->
                <li style="display:inline;filter: invert(100%); ">
                  <a href="//www.facebook.com/mexicoXgob/" target="_blank">
                    <img alt="logo fb" src="https://sisadmin.mexicox.gob.mx/redessociales/facebook1.png" height="40px"
                         style=" margin-left:15px;"/></a></li>
                <li style="display:inline;filter: invert(100%); ">
                  <a href="//twitter.com/MexicoX_gob?lang=es" target="_blank">
                    <img alt="logotipo tw" src="https://sisadmin.mexicox.gob.mx/redessociales/twitter1.png"
                         style="margin-left:6px;" height="40px"/>
                  </a>
                </li>
              </div>
            </footer>

            <!-- Google tag (gtag.js) -->
            <script async="" src="https://www.googletagmanager.com/gtag/js?id=G-Z97Y3FJQ9H"></script>
            <script>
              window.dataLayer = window.dataLayer || [];

              function gtag() {
              dataLayer.push(arguments);
            }

              gtag('js', new Date());

              gtag('config', 'G-Z97Y3FJQ9H');
            </script>
          </div>
        </footer>
      </div>
    </>
  );
};

export default App;
