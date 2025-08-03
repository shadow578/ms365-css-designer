/* eslint-disable @next/next/no-img-element -- needed for ms layouts*/
import { useTranslations } from "next-intl";
import { useState } from "react";
import { api } from "~/trpc/react";

type ClickHandler = () => void;
type InputHandler = (newValue: string) => void;

function SignInOptions() {
  const t = useTranslations("ms.promoted_fed_cred_box");

  return (
    <div className="promoted-fed-cred-box ext-promoted-fed-cred-box">
      <div className="promoted-fed-cred-content">
        <div className="tile-container">
          <div className="row tile">
            <div
              className="table"
              role="button"
              tabIndex={0}
              aria-label={t("label")}
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
                  <div>{t("label")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BoilerplateText(props: { text?: string }) {
  return (
    <div
      id="idBoilerPlateText"
      className="wrap-content boilerplate-text ext-boilerplate-text"
      hidden={!props.text}
      dangerouslySetInnerHTML={{ __html: props.text ?? "" }}
    ></div>
  );
}

function UsernamePage(props: {
  username: string;
  boilerplateText?: string;
  onUsernameChange?: InputHandler;
  onSubmit?: ClickHandler;
}) {
  const t = useTranslations("ms.form.username");

  return (
    <div role="main">
      <div>
        <div className="pagination-view animate slide-in-next">
          <div>
            <div>
              <div>
                <div className="row title ext-title" id="loginHeader">
                  <div role="heading" aria-level={1}>
                    {t("title")}
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
                    aria-label={t("input.aria_label")}
                    aria-describedby="loginHeader usernameError"
                    placeholder={t("input.placeholder")}
                    value={props.username}
                    onChange={(e) => {
                      props.onUsernameChange?.(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="password-reset-links-container ext-password-reset-links-container">
              <div className="row">
                <div className="col-md-24">
                  <div className="text-13">
                    <div className="form-group">
                      {t.rich("account_options.create.text", {
                        a: (c) => (
                          <a
                            href="#"
                            id="signup"
                            aria-label={t("account_options.create.aria_label")}
                          >
                            {c}
                          </a>
                        ),
                      })}
                    </div>
                    <div className="form-group">
                      <a id="cantAccessAccount" href="#">
                        {t("account_options.recover")}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="win-button-pin-bottom boilerplate-button-bottom">
              <div className="row move-buttons">
                <div>
                  <div className="col-xs-24 no-padding-left-right button-container button-field-container ext-button-field-container">
                    <div className="inline-block button-item ext-button-item">
                      <button
                        id="idSIButton9"
                        className="win-button button_primary high-contrast-overrides button ext-button primary ext-primary"
                        onClick={(e) => {
                          e.preventDefault();
                          props.onSubmit?.();
                        }}
                      >
                        {t("button.submit")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <BoilerplateText text={props.boilerplateText} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordPage(props: {
  username: string;
  password: string;
  boilerplateText?: string;
  passwordInvalid?: boolean;
  onPasswordChange?: InputHandler;
  onBack?: ClickHandler;
  onSubmit?: ClickHandler;
}) {
  const t = useTranslations("ms.form.password");

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
                aria-label={t("button.back.aria_label")}
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
                {t("title")}
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-24">
                <div role="alert" aria-live="assertive">
                  {props.passwordInvalid ? (
                    <div id="passwordError" className="error ext-error">
                      {t.rich("error.password", {
                        a: (c) => (
                          <a id="idA_IL_ForgotPassword0" href="#" role="link">
                            {c}
                          </a>
                        ),
                      })}
                    </div>
                  ) : null}
                </div>
                <div className="placeholderContainer">
                  <input
                    name="passwd"
                    type="password"
                    id="i0118"
                    className="form-control input ext-input text-box ext-text-box"
                    aria-required="true"
                    autoComplete="current-password"
                    aria-describedby="loginHeader passwordError  "
                    placeholder={t("input.placeholder")}
                    aria-label={t("input.aria_label", {
                      username: props.username,
                    })}
                    tabIndex={0}
                    value={props.password}
                    onChange={(e) => {
                      props.onPasswordChange?.(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="password-reset-links-container ext-password-reset-links-container">
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
                          {t("forgot_password")}
                        </a>
                      </div>
                      <div className="form-group"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="win-button-pin-bottom boilerplate-button-bottom">
              <div className="row move-buttons">
                <div>
                  <div className="col-xs-24 no-padding-left-right button-container button-field-container ext-button-field-container">
                    <div className="inline-block button-item ext-button-item">
                      <button
                        id="idSIButton9"
                        className="win-button button_primary high-contrast-overrides button ext-button primary ext-primary"
                        onClick={props.onSubmit}
                      >
                        {t("button.submit")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <BoilerplateText text={props.boilerplateText} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  const t = useTranslations("ms.footer");

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
            {t("terms")}
          </a>
          <a
            id="ftrPrivacy"
            href="#"
            className="footer-content ext-footer-content footer-item ext-footer-item"
          >
            {t("privacy")}
          </a>
          <a
            id="moreOptions"
            href="#"
            role="button"
            aria-label={t("more_options.aria_label")}
            aria-expanded="false"
            className="footer-content ext-footer-content footer-item ext-footer-item debug-item ext-debug-item"
          >
            {t("more_options.text")}
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
  const t = useTranslations("ms.form.lightbox");

  return (
    <div className="cb" style={{ display: "block" }}>
      <div>
        <form
          name="f1"
          noValidate
          spellCheck="false"
          autoComplete="off"
          className="provide-min-height"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
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
                    aria-label={t("background_image.aria_label")}
                  />
                </div>

                {props.backgroundImage ? (
                  <div className="background-overlay ext-background-overlay"></div>
                ) : null}
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
                              {props.bannerLogo ? (
                                <img
                                  id="bannerLogo"
                                  className="banner-logo ext-banner-logo"
                                  role="img"
                                  src={props.bannerLogo}
                                  alt={t("banner_logo.aria_label.org")}
                                />
                              ) : (
                                <img
                                  className="logo"
                                  role="img"
                                  src="ms/microsoft-logo.svg"
                                  alt={t("banner_logo.aria_label.ms")}
                                />
                              )}
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
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [page, setPage] = useState<"username" | "password">("username");

  const branding = api.branding.getBranding.useMutation();

  const onUsernameSubmit = async () => {
    if (!username) return;

    console.log("Username submitted:", username);
    const data = await branding.mutateAsync({ username });
    console.log("Branding Data:", data);

    setPage("password");
  };

  const onPasswordSubmit = () => {
    setPasswordInvalid(true);
  };

  const onReturnToUsername = () => {
    branding.reset();
    setPasswordInvalid(false);
    setPage("username");
  };

  return (
    <>
      <LightboxTemplateContainer
        signInOptions={page === "username"}
        footer
        bannerLogo={branding.data?.assets?.BannerLogo}
        backgroundImage={branding.data?.assets?.Illustration}
      >
        {page === "username" ? (
          <UsernamePage
            username={username}
            onUsernameChange={setUsername}
            onSubmit={onUsernameSubmit}
          />
        ) : null}
        {page === "password" ? (
          <PasswordPage
            username={branding.data?.userDisplayName ?? username}
            password={password}
            boilerplateText={branding.data?.boilerplateText}
            passwordInvalid={passwordInvalid}
            onPasswordChange={setPassword}
            onBack={onReturnToUsername}
            onSubmit={onPasswordSubmit}
          />
        ) : null}
      </LightboxTemplateContainer>
    </>
  );
}
