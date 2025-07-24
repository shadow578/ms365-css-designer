/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import "./signin.css";

type ClickHandler = () => void;
type InputHandler = (newValue: string) => void;

function SignInOptions() {
  return (
    <div className="promoted-fed-cred-box ext-promoted-fed-cred-box">
      <div className="promoted-fed-cred-content">
        <div className="tile-container">
          <div className="row tile">
            <div
              className="table"
              role="button"
              tabIndex={0}
              aria-label="Anmeldeoptionen undefined"
            >
              <div className="table-row">
                <div className="table-cell tile-img medium">
                  <img
                    className="tile-img medium"
                    role="presentation"
                    alt="presentation"
                    src="ms/signin-options.svg"
                  />
                </div>
                <div className="table-cell text-left content">
                  <div>Anmeldeoptionen</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UsernamePage(props: {
  username: string;
  onUsernameChange?: InputHandler;
  onSubmit?: ClickHandler;
}) {
  return (
    <div role="main">
      <div>
        <div className="pagination-view animate slide-in-next">
          <div>
            <div>
              <div>
                <div className="row title ext-title" id="loginHeader">
                  <div role="heading" aria-level={1}>
                    Anmelden
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div role="alert" aria-live="assertive"></div>
              <div className="form-group col-md-24">
                <div className="placeholderContainer">
                  <input
                    type="email"
                    name="loginfmt"
                    maxLength={113}
                    className="form-control ltr_override input ext-input text-box ext-text-box"
                    aria-required="true"
                    autoComplete="username webauthn"
                    aria-label="Geben Sie Ihre E-Mail-Adresse, Telefonnummer oder Ihren Skype-Namen ein."
                    aria-describedby="loginHeader usernameError"
                    placeholder="E-Mail, Telefon oder Skype"
                    value={props.username}
                    onChange={(e) => {
                      props.onUsernameChange?.(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="position-buttons password-reset-links-container ext-password-reset-links-container">
              <div className="row">
                <div className="col-md-24">
                  <div className="text-13">
                    <div className="form-group">
                      Kein Konto?{" "}
                      <a
                        href="#"
                        id="signup"
                        aria-label="Microsoft-Konto erstellen"
                      >
                        Erstellen Sie jetzt eins!
                      </a>
                    </div>
                    <div className="form-group">
                      <a id="cantAccessAccount" href="#">
                        Sie können nicht auf Ihr Konto zugreifen?
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="win-button-pin-bottom">
              <div className="row">
                <div>
                  <div className="col-xs-24 no-padding-left-right button-container button-field-container ext-button-field-container">
                    <div className="inline-block button-item ext-button-item">
                      <button
                        id="idSIButton9"
                        className="win-button button_primary high-contrast-overrides button ext-button primary ext-primary"
                        onClick={props.onSubmit}
                      >
                        Weiter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordPage(props: {
  username: string;
  password: string;
  onPasswordChange?: InputHandler;
  onBack?: ClickHandler;
  onSubmit?: ClickHandler;
}) {
  return (
    <div role="main">
      <div>
        <div className="animate slide-in-next">
          <div>
            <div className="identityBanner">
              <button
                type="button"
                className="backButton"
                id="idBtn_Back"
                aria-label="Zurück"
                onClick={props.onBack}
              >
                <img
                  role="presentation"
                  alt="presentation"
                  src="ms/arrow-left.svg"
                />
              </button>
              <div id="displayName" className="identity" title={props.username}>
                {props.username}
              </div>
            </div>
          </div>
        </div>
        <div className="pagination-view has-identity-banner animate slide-in-next">
          <div>
            <div id="loginHeader" className="row title ext-title">
              <div role="heading" aria-level={1}>
                Kennwort eingeben
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-24">
                <div role="alert" aria-live="assertive"></div>
                <div className="placeholderContainer">
                  <input
                    name="passwd"
                    type="password"
                    id="i0118"
                    className="form-control input ext-input text-box ext-text-box"
                    aria-required="true"
                    autoComplete="current-password"
                    aria-describedby="loginHeader passwordError  "
                    placeholder="Kennwort"
                    aria-label={`Geben Sie das Kennwort für "${props.username}" ein.`}
                    tabIndex={0}
                    value={props.password}
                    onChange={(e) => {
                      props.onPasswordChange?.(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="position-buttons password-reset-links-container ext-password-reset-links-container">
              <div>
                <div className="row">
                  <div className="col-md-24">
                    <div className="text-13">
                      <div className="form-group">
                        <a
                          id="idA_PWD_ForgotPassword"
                          href="#"
                          target=""
                          role="link"
                        >
                          Kennwort vergessen
                        </a>
                      </div>
                      <div className="form-group"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="win-button-pin-bottom">
              <div className="row">
                <div>
                  <div className="col-xs-24 no-padding-left-right button-container button-field-container ext-button-field-container">
                    <div className="inline-block button-item ext-button-item">
                      <button
                        id="idSIButton9"
                        className="win-button button_primary high-contrast-overrides button ext-button primary ext-primary"
                        onClick={props.onSubmit}
                      >
                        Anmelden
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div id="footer" role="contentinfo" className="footer ext-footer">
      <div>
        <div
          id="footerLinks"
          className="footerNode text-secondary footer-links ext-footer-links"
        >
          <a
            id="ftrTerms"
            href="#"
            className="footer-content ext-footer-content footer-item ext-footer-item"
          >
            Nutzungsbedingungen
          </a>
          <a
            id="ftrPrivacy"
            href="#"
            className="footer-content ext-footer-content footer-item ext-footer-item"
          >
            Datenschutz und Cookies
          </a>
          <a
            id="moreOptions"
            href="#"
            role="button"
            aria-label="Klicken Sie hier, um weitere Informationen zur Problembehandlung zu erhalten."
            aria-expanded="false"
            className="footer-content ext-footer-content footer-item ext-footer-item debug-item ext-debug-item"
          >
            ...
          </a>
        </div>
      </div>
    </div>
  );
}

function LightboxTemplateContainer(props: {
  children: React.ReactNode;
  signInOptions?: boolean;
  footer?: boolean;
  backgroundImage?: string;
  bannerLogo?: string;
}) {
  return (
    <div className="cb" style={{ display: "block" }}>
      <div>
        <form
          name="f1"
          noValidate
          spellCheck="false"
          method="post"
          target="_top"
          autoComplete="off"
          className="provide-min-height"
        >
          <div className="login-paginated-page">
            <div id="lightboxTemplateContainer" className="provide-min-height">
              <div id="lightboxBackgroundContainer">
                <div className="background-image-holder" role="presentation">
                  <div
                    id="backgroundImage"
                    role="img"
                    style={{
                      backgroundImage: `url("${props.backgroundImage ?? "ms/background.svg"}")`,
                    }}
                    className="background-image ext-background-image"
                    aria-label="Hintergrundbild der Organisation"
                  />
                </div>
              </div>
              <div className="outer">
                <div className="template-section main-section">
                  <div className="middle ext-middle">
                    <div className="full-height">
                      <div className="flex-column">
                        <div className="win-scroll">
                          <div
                            id="lightbox"
                            className="sign-in-box ext-sign-in-box fade-in-lightbox has-popup"
                          >
                            <div className="lightbox-cover"></div>
                            <div>
                              <img
                                className="logo"
                                role="img"
                                src={
                                  props.bannerLogo ?? "ms/microsoft-logo.svg"
                                }
                                alt="Microsoft"
                              />
                            </div>
                            {props.children}
                          </div>
                          <div>
                            {props.signInOptions ? <SignInOptions /> : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {props.footer ? <Footer /> : null}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MSConvergedSignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [page, setPage] = useState<"username" | "password">("username");

  return (
    <LightboxTemplateContainer
      signInOptions={page === "username"}
      footer
    >
      {page === "username" ? (
        <UsernamePage
          username={username}
          onUsernameChange={setUsername}
          onSubmit={() => setPage("password")}
        />
      ) : null}
      {page === "password" ? (
        <PasswordPage
          username={username}
          password={password}
          onPasswordChange={setPassword}
          onBack={() => setPage("username")}
          onSubmit={() => {
            alert(`Signing in with ${username} and password: ${password}`);
          }}
        />
      ) : null}
    </LightboxTemplateContainer>
  );
}
