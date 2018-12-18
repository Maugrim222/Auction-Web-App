<template>
  <div id="app">

    <!-- ---------------------------------------------------------------------------------------------------------- -->
    <!-- Header -->
    <!-- ---------------------------------------------------------------------------------------------------------- -->


    <div class="card text-center">

      <div>
        <b-navbar type="dark" variant="primary" toggleable>
          <b-navbar-toggle target="nav_dropdown_collapse"></b-navbar-toggle>
          <b-collapse is-nav id="nav_dropdown_collapse">
            <b-navbar-nav>


              <b-nav-item href="#">
                <router-link :to="{ name: 'auctions'}">
                  <button type="button" class="btn btn-primary navbar-right"> Overview </button>
                </router-link>
              </b-nav-item>

              <b-nav-item href="#" v-if="this.userLoggedIn">
                <button type="button" class="btn btn-primary navbar-right" data-toggle="modal"
                        data-target="#userDetailsModal"> My Account
                </button>
              </b-nav-item>


              <b-nav-item href="#" v-if="this.userLoggedIn">
                <router-link :to="{ name: 'auctions'}">
                  <button type="button" class="btn btn-primary navbar-right" @click="logOut"> Log out </button>
                </router-link>
              </b-nav-item>

              <b-nav-item href="#" v-if="this.userLoggedIn">
                <router-link :to="{ name: 'manageAuctions'}">
                  <button type="button" class="btn btn-primary navbar-right"> My Auctions </button>
                </router-link>
              </b-nav-item>


              <!----------------------------------------------------------------------------------------------------------------------------------->
              <!--                                                       LOGIN   MODAL                                                           -->
              <!----------------------------------------------------------------------------------------------------------------------------------->
              <!--This V modal used to be in a b-nav-item tag but it didnt load the modal content so i took it out but now the buttons dont align-->

              <v-layout row justify-center>
                <v-dialog v-model="dialog2" max-width="600px">


                  <v-btn style="padding-left: 10px; margin-left: 200px" v-if="!this.userLoggedIn" slot="activator" color="primary" class="blue lighten-1" dark> Log IN </v-btn>

                  <v-card>


                    <v-card-title>
                      <span class="headline">Login Existing User</span>
                    </v-card-title>
                    <v-card-text>


                      <v-form ref="form" v-model="validLogIn" lazy-validation>

                        <v-text-field
                          v-model="usernameInput"
                          :rules="nameRules"
                          :counter="20"
                          label="Username"
                        ></v-text-field>

                        <v-text-field
                          v-model="emailInput"

                          :rules="emailRules"
                          label="E-mail"
                        ></v-text-field>

                        <v-text-field
                          v-model="passwordInput"
                          label="Password"
                          :type="'password'"
                          required
                        ></v-text-field>



                        <v-btn  :disabled="!validLogIn" @click="logIn" @click.stop="dialog2=false" :to="{ name: 'auctions'}" >submit </v-btn>


                        <v-btn @click="clear1"> clear</v-btn>
                        <v-btn @click.stop="dialog2=false"> cancel</v-btn>


                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-dialog>
              </v-layout>


              <!----------------------------------------------------------------------------------------------------------------------------------->
              <!--                                                      REGISTER MODAL                                                           -->
              <!----------------------------------------------------------------------------------------------------------------------------------->
              <!--This V modal used to be in a b-nav-item tag but it didnt load the modal content so i took it out but now the buttons dont align-->

              <v-layout>
                <v-dialog v-model="dialog" max-width="500px">
                  <v-btn style="margin-left: 20px" v-if="!this.userLoggedIn" slot="activator" color="primary" class="blue lighten-1">Register
                  </v-btn>
                  <v-card>
                    <v-card-title>
                      <span class="headline">Register New User</span>
                    </v-card-title>
                    <v-card-text>

                      <v-form ref="form" v-model="validReg" lazy-validation>
                        <v-text-field
                          v-model="givenNameInputReg"
                          :rules="nameRules2"
                          :counter="20"
                          label="Given Name"
                          required
                        ></v-text-field>

                        <v-text-field
                          v-model="familyNameInputReg"
                          :rules="nameRules2"
                          :counter="20"
                          label="Family Name"
                          required
                        ></v-text-field>

                        <v-text-field
                          v-model="usernameInputReg"
                          :rules="nameRules2"
                          :counter="20"
                          label="Username"
                          required
                        ></v-text-field>

                        <v-text-field
                          v-model="emailInputReg"
                          :rules="emailRules2"
                          label="E-mail"
                          required
                        ></v-text-field>

                        <v-text-field
                          v-model="passwordInputReg"
                          label="Password"
                          :type="'password'"
                          required
                        ></v-text-field>

                      </v-form>
                      <small>*indicates required field</small>
                    </v-card-text>
                    <v-card-actions>

                      <v-spacer></v-spacer>

                      <v-btn :disabled="!validReg" @click="registerUser" @click.stop="dialog=false"> submit </v-btn>
                      <v-btn @click="this.clear">clear</v-btn>
                      <v-btn @click.stop="dialog=false"> cancel</v-btn>

                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-layout>


              <b-nav-item href="#" style="padding-left: 40%">
                <div class="text-md-right text-lg-right" style="float: right">
                  <v-chip color="indigo" text-color="white">
                    <v-avatar>
                      <v-icon>account_circle</v-icon>
                    </v-avatar>
                    {{user.username}}

                  </v-chip>
                </div>
              </b-nav-item>


            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
      </div>


      <div id="error" v-if="errorFlag" style="background-color: red">
        <div>
          <v-alert v-model="alert" type="error" dismissible>
            Failed to login - Incorrect username, email or password
          </v-alert>
        </div>
      </div>

      <div id="error2" v-if="errorFlag2" style="background-color: red">
        <div>
          <v-alert v-model="alert" type="error" dismissible>
            Failed to register
          </v-alert>
        </div>
      </div>


      <!-- ---------------------------------------------------------------------------------------------------------- -->
      <!-- userDetailsModal modal: Displays user details -->
      <!-- ---------------------------------------------------------------------------------------------------------- -->


      <div class="modal fade" id="userDetailsModal" tabindex="-1" role="dialog" aria-labelledby="userDetailsModal"
           aria-hidden="true">

        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">

              <h5 class="modal-title" id="userDetailsModalLabel">User Details</h5>

              <span aria-hidden="true">&times;</span>

            </div>
            <div class="modal-body">
              <table class="table table-borderless">
                <tbody>

                <tr>
                  <td>User Name</td>
                  <td> {{this.currentUsername}}  </td>
                </tr>

                <tr>
                  <td>Given Name</td>
                  <td> {{this.currentGivenName}}  </td>
                </tr>

                <tr>
                  <td>Family Name</td>
                  <td>{{this.currentFamilyName}}</td>
                </tr>

                <tr>
                  <td>E-Mail</td>
                  <td>{{this.currentEmail}}</td>
                </tr>

                <tr>
                  <td>Account Balance</td>
                  <td> {{ this.accountBalance }} </td>
                </tr>

                </tbody>
              </table>

              <small id="emailHelp" class="form-text text-muted">Submit the form below to update your information
              </small>

              <form>

                <div class="form-group">
                  <label for="newGivenNameInput">Given Name</label>
                  <input type="text" class="form-control" id="newGivenNameInput" v-model="newGivenNameInput"
                         placeholder="First Name" value="John"
                         required>
                </div>

                <div class="form-group">
                  <label for="newFamilyNameInput"> Family Name </label>
                  <input type="text" class="form-control" id="newFamilyNameInput" v-model="newFamilyNameInput"
                         placeholder="Last Name" value="Smith"
                         required>
                </div>



                <button type="submit" class="btn btn-primary" @click.prevent="updateUserInfo"> Submit </button>

              </form>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal"> Close          </button>
            </div>
            <div>


            </div>
          </div>
        </div>
      </div>

      <router-view>

        <!-- Variable content -->

      </router-view>

    </div>

  </div>
</template>

<!-- ---------------------------------------------------------------------------------------------------------- -->
<!--                                                SCRIPT                                                      -->
<!-- ---------------------------------------------------------------------------------------------------------- -->

<script>
  export default {
    data() {
      return {
        validLogIn: false,
        validReg: false,
        name: '',
        nameRules: [
          /* v => !!v || 'Name is required',*/
          v => v.length <= 20 || 'Name must be less than 10 characters'
        ],
        nameRules2: [
          v => !!v || 'Name is required',
          v => (v && v.length <= 20) || 'Name must be less than 20 characters'],
        email: '',
        emailRules: [
          /*v => !!v || 'E-mail is required',*/
         /*  v =>  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'*/
          ],
        emailRules2: [
          v => !!v || 'E-mail is required',
          v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'],
        select: null,
        items: [
          'Item 1',
          'Item 2',
          'Item 3',
          'Item 4'
        ],
        checkbox: false,
        error: "",
        error2: "",
        errorFlag2: false,
        errorFlag: false,
        errorMessage: "",
        auctions: [],
        auction: {},
        bids: [],
        categories: [],
        dialog: false,
        dialog2: false,
        alert: true,

        // stores the currently logged in user
        user: [],

        // dynamic vars storing login modal input
        emailInput: '',
        usernameInput: '',
        passwordInput: '',

        // dynamic vars storing registration modal input
        givenNameInputReg: "",
        familyNameInputReg: "",
        usernameInputReg: "",
        emailInputReg: "",
        passwordInputReg: "",

        // dynamic var for search input
        searchBarInput: "",

        //current user data
        currentUsername: "",
        currentEmail: "",
        currentGivenName: "",
        currentFamilyName: "",
        accountBalance: 0,

        newGivenNameInput: '',
        newFamilyNameInput: '',

        userLoggedIn: false,

        dismissSecs: 5,
        dismissCountDown: 0

      }
    },

    /*<!-- ---------------------------------------------------------------------------------------------------------- -->
    <!--                                           MOUNTED FUNCTION                                                 -->
    <!-- ---------------------------------------------------------------------------------------------------------- -->*/
    mounted: function () {
      console.log('Begin mounted....');
      if (this.$route.params.auction_id) {
        this.getSingleAuction(this.$route.params.auction_id);

        this.getBids(this.$route.params.auction_id);
        localStorage.setItem("userLoggedIn", false);
        this.getCategories();
      } else {
        this.getAuctions();
        this.getCategories();
      }

    },


    methods: {

      clear1: function () {
        this.emailInput = "";
        this.usernameInput = "";
        this.passwordInput = "";
      },

      countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
      },
      showAlert() {
        this.dismissCountDown = this.dismissSecs
      },

      submit() {
        if (this.$refs.form.validate()) {
          // Native form submission is not yet supported
          axios.post('/api/submit', {
            name: this.name,
            email: this.email,
            select: this.select,
            checkbox: this.checkbox
          })
        }
      },

      clear: function() {
        this.$refs.form.reset()
      },

      updateUserInfo: function () {
        console.log("Updating User Information...");
        this.$http.patch('http://localhost:4941/api/v1/users/' + localStorage.getItem("userID"), JSON.stringify({
          "givenName": this.newGivenNameInput,
          "familyName": this.newFamilyNameInput
        }), {headers: {"X-Authorization": localStorage.getItem("userToken")}})
          .then(function (response) {
            /*this.result = response.data;
            console.log(result);*/
            console.log("Update complete!");
            this.getUserData(localStorage.getItem("userID"))
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
            this.errorMessage = "Failed to Update"
          })
      },

      /////////////////////         GETTER FUNCTIONS

      getAuctions: function () {
        console.log("Getting all auctions...");
        this.$http.get('http://localhost:4941/api/v1/auctions')
          .then(function (response) {
            this.auctions = response.data;

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          })
      },

      getSingleAuction: function (id) {
        this.$http.get('http://localhost:4941/api/v1/auctions/' + id)
          .then(function (response) {
            this.auction = response.data;

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },

      getBids: function (bid_id) {
        console.log("Getting all bids...");
        this.$http.get('http://localhost:4941/api/v1/auctions/' + bid_id + '/bids')
          .then(function (response) {
            this.bids = response.data;

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          })
      },

      getAuctionByName: function () {
        console.log("Retrieving auction by search parameter...");
        // should i get the input string internally or pass as parameter
        for (var key in this.auctions) {
          if (!this.auctions[key].title.includes(searchBarInput)) {
            //now set the shown status of all auctions WITHOUT the substring to false
            this.auctions[key].shown = false;
          }
        }

      },

      getCategories: function (bid_id) {
        console.log("Getting categories...");
        this.$http.get('http://localhost:4941/api/v1/categories')
          .then(function (response) {
            this.categories = response.data;

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          })
      },

      /* <!-- ---------------------------------------------------------------------------------------------------------- -->
       <!-- userDetailsModal modal: Displays user details -->
       <!-- ---------------------------------------------------------------------------------------------------------- -->*/

      logIn: function () {

        if (this.usernameInput) {
          console.log("Logging In...");
          this.$http.post('http://localhost:4941/api/v1/users/login', JSON.stringify({
            "username": this.usernameInput,
            "password": this.passwordInput
          }))
            .then(function (response) {
              this.user = response.data;
              localStorage.setItem("userToken", this.user.token);
              localStorage.setItem("userID", this.user.id);
              this.getUserData(this.user.id);
              this.userLoggedIn = true;
              localStorage.setItem("userLoggedIn", true);
              console.log(localStorage.getItem("userLoggedIn"));
              console.log("Login successful!");

            }, function (error) {
              this.error = error;
              this.errorFlag = true;
              this.errorMessage = "Failed to Login";
            });
        }
        else {
          console.log("Logging In...");
          this.$http.post('http://localhost:4941/api/v1/users/login', JSON.stringify({
            "email": this.emailInput,
            "password": this.passwordInput
          }))
            .then(function (response) {
              this.user = response.data;
              localStorage.setItem("userToken", this.user.token);
              localStorage.setItem("userID", this.user.id);
              this.getUserData(this.user.id);
              this.userLoggedIn = true;
              localStorage.setItem("userLoggedIn", true);
              console.log(localStorage.getItem("userLoggedIn"));
              console.log("Login successful!");

            }, function (error) {
              this.error = error;
              this.errorFlag = true;
              this.errorMessage = "Failed to Login";
            });

        }


        /*$('#logRegModal').modal('hide');*/

      }
      ,

      getUserData: function (userID) {
        this.user = [];
        console.log("Getting user data...");
        this.$http.get('http://localhost:4941/api/v1/users/' + userID, {headers: {"X-Authorization": localStorage.getItem("userToken")}})
          .then(function (response) {
            this.user = response.data;

            /*localStorage.setItem("userID", this.user.id);
            localStorage.setItem("userID", this.user.id);*/

            this.currentUsername = this.user.username;
            this.currentGivenName = this.user.givenName;
            this.currentFamilyName = this.user.familyName;
            this.currentEmail = this.user.email;
            this.accountBalance = this.user.accountBalance;


          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          })
      },


      /////////////////////         REGISTER FUNCTION

      registerUser: function () {

        this.$http.post('http://localhost:4941/api/v1/users', JSON.stringify({
          "username": this.usernameInputReg,
          "givenName": this.givenNameInputReg,
          "familyName": this.familyNameInputReg,
          "email": this.emailInputReg,
          "password": this.passwordInputReg,
        }))
          .then(function (response) {
            console.log("Logging In...");
            this.$http.post('http://localhost:4941/api/v1/users/login', JSON.stringify({
              "username": this.usernameInputReg,
              "password": this.passwordInputReg
            }))
              .then(function (response) {
                this.user = response.data;
                localStorage.setItem("userToken", this.user.token);
                localStorage.setItem("userID", this.user.id);
                this.getUserData(this.user.id);
                this.userLoggedIn = true;
                localStorage.setItem("userLoggedIn", true);
                console.log(localStorage.getItem("userLoggedIn"));
                console.log("Login successful!");

              }, function (error) {
                this.error = error;
                this.errorFlag = true;
                this.errorMessage = "Failed to Login";
              })
          })
      },

      /*$('#logRegModal').modal('hide');*/



      /////////////////////         LOGOUT FUNCTION
      logOut: function () {
        this.user = [];
        this.userLoggedIn = false;
        localStorage.setItem("userLoggedIn", false);
      }

    },
  }

</script>
