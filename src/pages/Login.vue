<template>
  <div id="login">
    <div id="description">
      <img src="../assets/favicon.png" width="100px" />
      <h1 style="color: #161a1f;">{{$t('login')}}</h1>
      <p>{{ $t('login_welcome')}}</p>
    </div>
    <b-overlay :show="loading" rounded="sm">
      <div id="form">
        <b-form @submit.prevent="handleLogin">
          <b-form-group
            label="Email"
            label-for="email"
            :invalid-feedback="errors.first('Email')"
            :state="!submitted && errors.has('Email')">
            <b-form-input 
              id="email" 
              name="Email"
              type="text" 
              v-model="form.email" 
              v-validate="'required|email'"
              placeholder="ejemplo@mailbox.com" 
              autocomplete="off">
            </b-form-input>
          </b-form-group>
          
          <b-form-group
            description=""
            :label="$t('password')"
            label-for="password"
            :invalid-feedback="errors.first('Contraseña')"
            :state="!submitted && errors.has('Contraseña')">
            <b-row>
              <b-col sm="10">
                  <b-form-input 
                    id="password" 
                    name="Contraseña"
                    :type="passwordType" 
                    v-model="form.password" 
                    v-validate="'required'"
                    placeholder="**********"
                    ref="password">
                  </b-form-input>
              </b-col>
              <b-col sm="2">
                <i 
                  class="fas" 
                  style="margin-top: 10px;" 
                  :class="[passwordIcon]" 
                  @click="hidePassword = !hidePassword">
                </i>
              </b-col>
            </b-row>
          </b-form-group>

          <b-button 
            id="login-button" 
            type="submit">
            {{$t('login')}}
          </b-button>

          <b-button 
           @click="login_auth0" class="login-auth0-button">
          <strong>{{$t('login_auth0')}}</strong></b-button>

          <p style="margin-top: 15px; text-align: center;">
            {{$t('new_to_abastify')}}
          </p>

          <b-button 
            id="register-button" 
            @click="goToRegister">
            {{$t('register')}}
          </b-button>

        </b-form>
      </div>
    </b-overlay>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { userService } from '../services/user.service';

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      submitted: false,
      hidePassword: true,
      loading: false
    }
  },
  computed: {
    passwordType() {
      return this.hidePassword ? 'password' : 'text'
    },

    passwordIcon() {
      return this.hidePassword ? 'fa-eye' : 'fa-eye-slash'
    }
  },
  methods: {
    ...mapActions('account', ['login', 'register']),
    handleLogin() {
      this.submitted = true
      this.loading = true
      this.$validator.validate().then(valid => {
        if (valid) {
          this.login(this.form)
        }
        this.loading = false
      })
    },
    goToRegister() {
      this.$router.push('/register')
    },
    async login_auth0() {
      await this.$auth.loginWithPopup();
      let auth0_user = this.$auth.user
      this.submitted = true
      this.loading = true
      userService.check_availability(auth0_user.email)
      .then(() => {
        this.register({
          firstName: auth0_user.name,
          lastName: auth0_user.family_name,
          email: auth0_user.email,
          password: auth0_user.sub,
          repeatedPassword: auth0_user.sub
        })
        setTimeout( () =>{
          this.login({
            email: auth0_user.email,
            password: auth0_user.sub
          })
        }, 5000)
      })
      .catch(() => {
        this.login({
          email: auth0_user.email,
          password: auth0_user.sub
        })  
      })
      .finally(() => {
        this.loading = false
      })
      //this.$router.push('/')
    }
  }
}
</script>

<style scoped>
div#login {
  align-items: center;
  background-color: #e2e2e5;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 75vh;
}

div#login div#description {
  background-color: #ffffff;
  width: 250px;
  padding: 35px;
  text-align: center;
  border-radius: 5px 0px 0px 5px;
  box-shadow: -20px 0px 30px 0px #666
}

div#login div#description h1,
div#login div#description p {
  margin: 0;
}

div#login div#description p {
  font-size: 0.8em;
  color: #5a5a5a;
  margin-top: 10px;
}

div#login div#form {
  background-color: #0e1013;
  border-radius: 5px 5px 5px 5px;
  box-shadow: 20px 0px 30px 0px #666;
  color: #f3f4f5;
  width: 400px;
  padding: 35px;
}

div#login div#form input {
  background-color: transparent;
  border: none;
  color: #ecf0f1;
  font-size: 1em;
}

div#login div#form ::placeholder {
  color: #bbbbbb;
  opacity: 1;
}

div#login div#form button#login-button {
  background-color: #ffffff;
  color: #333333;
  cursor: pointer;
  border: none;
  padding: 10px;
  transition: background-color 0.2s ease-in-out;
  width: 100%;
}

div#login div#form button:hover#login-button {
  background-color: #cccccc;
  color: #000000;
}

.login-auth0-button {
  background-color: #ffffff;
  color: #333333;
  cursor: pointer;
  border: none;
  padding: 10px;
  transition: background-color 0.2s ease-in-out;
  width: 100%;
}

.login-auth0-button:hover {
  background-color: #cccccc;
  color: #000000;
}

div#login div#form button#register-button {
  background-color: #173541;
  color: #cccccc;
  cursor: pointer;
  border: none;
  padding: 10px;
  transition: background-color 0.2s ease-in-out;
  width: 100%;
}

div#login div#form button:hover#register-button {
  background-color: #cccccc;
  color: #000000;
}

@media screen and (max-width: 600px) {
  div#login {
    align-items: unset;
    background-color: unset;
    display: unset;
    justify-content: unset;
  }

  div#login div#description {
    margin: 0 auto;
    max-width: 350px;
    width: 100%;
  }

  div#login div#form {
    border-radius: unset;
    box-shadow: unset;
    width: 100%;
  }
}

</style>