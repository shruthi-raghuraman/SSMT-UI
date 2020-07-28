import React from 'react';
import {
  LoginForm,
  LoginPage as PatternflyLoginPage,
  ListVariant,
  Button
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import * as OAuth from 'oauth2-client-js';

import { Role } from '..';
import mocLogo from './moc_logo.png';
type LoginState = {
  username: string;
  password: string;
  submit: boolean;
  error?: string;
};

type LoginProps = {
  setRole: Function;
};

class LoginPage extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      username: '',
      password: '',
      submit: false,
    };
  }

  // Detect if CILogon has authenticated, then log into app if it has.
  componentDidMount() {
    const query = new URL(window.location.href).search;
    if (query.includes('code')) { // CILogon has returned with code
      // remove query & CILogon state from URL, without reloading page
      const urlWithoutQuery = window.location.protocol + "//" + window.location.host + window.location.pathname
      window.history.pushState({path: urlWithoutQuery}, '' ,urlWithoutQuery); 
      this.props.setRole(Role.ADMIN);
      localStorage.setItem('login', 'ADMIN');
    } else if (localStorage.getItem('login')) {
      const storedRole = localStorage.getItem('login');
      if (storedRole === 'ADMIN') {
        this.props.setRole(Role.ADMIN);
      } else if (storedRole === 'DEVELOPER') {
        this.props.setRole(Role.DEVELOPER);
      }
    }
  }

  handleUsernameChange = (userNameInput: string) => {
    this.setState({ username: userNameInput });
  }

  handlePasswordChange = (passwordInput: string) => {
    this.setState({ password: passwordInput });
  }

  handleSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    // dynamic call
    const { username, password } = this.state;
    let role: Role;
    if (username === 'admin' && password === 'adminpass') {
      role = Role.ADMIN;
      localStorage.setItem('login', 'ADMIN');
    } else if ((username === 'developer1' && password === 'developer1pass') || (username === 'developer2' && password === 'developer2pass')) {
      role = Role.DEVELOPER;
      localStorage.setItem('login', 'DEVELOPER');
    } else {
      role = Role.NONE;
      this.setState({ ...this.state, error: "Invalid Username/Password" })
    }
    this.props.setRole(role);
  }

  handleCiLogon = () => {
    // Register provider
    const ciLogonProvider = new OAuth.Provider({
      id: 'cilogon',
      authorization_url: 'https://cilogon.org/authorize'
    })

    // Create a new request
    var request = new OAuth.Request({
      client_id: 'cilogon:/client_id/566ba77604386302bd6e0f63cfa0efe0',  // required
      redirect_uri: 'http://localhost:9000',
      scope: 'openid+profile+email+org.cilogon.userinfo+edu.uiuc.ncsa.myproxy.getcert',
      response_type: 'code'
    });

    // Give it to the provider
    var uri = ciLogonProvider.requestToken(request);

    // Redirect to CILogon authentication page
    window.location.href = uri;
  }

  render() {
    
    const loginForm = (
      <LoginForm
        showHelperText={!!this.state.error}
        helperText={this.state.error}
        helperTextIcon={<ExclamationCircleIcon />}
        usernameLabel="Username"
        usernameValue={this.state.username}
        onChangeUsername={this.handleUsernameChange}
        passwordLabel="Password"
        passwordValue={this.state.password}
        onChangePassword={this.handlePasswordChange}
        onLoginButtonClick={this.handleSubmit}
      />
    );

    return (
      <PatternflyLoginPage
        style={{ 
          background: 'linear-gradient(0deg, gray, transparent)',
        }}
        footerListVariants={ListVariant.inline}
        footerListItems={[
          <Button onClick={this.handleCiLogon} key="cilogon">Login with CILogon</Button>
        ]}
        brandImgSrc={mocLogo}
        brandImgAlt="MOC logo"
        textContent="Mass Open Cloud OCP Metering"
        loginTitle="Log in to your account"
        loginSubtitle="Please use your MOC credentials"
      >
        {loginForm}
      </PatternflyLoginPage>
    );
  }
}

export { LoginPage };
