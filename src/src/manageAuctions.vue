<template>


  <b-container fluid>




    <div>

<h1></h1>
  <b-button-group>


  <b-button v-on:click="getMyWonAuctions" pill variant="warning">Won Auctions</b-button>
      <b-button v-on:click="getMyBidAuctions" pill variant="warning">My Bids</b-button>
      <b-button  v-on:click="getMySellingAuctions" pill variant="warning">My Selling</b-button>
      <b-button v-on:click="getMyCompleteAuctions" pill variant="warning">My Completed</b-button>
      <b-button  v-on:click="getMyFailedAuctions" pill variant="warning">My Failed</b-button>
  </b-button-group>

    </div>

    <div>
      <b-btn v-b-modal.modallg variant="success">Create Auction</b-btn>


      <b-modal id="modallg" size="lg" title="Create a New Auction">
        <b-card bg-variant="light">



          <b-form-group horizontal
                        breakpoint="lg"
                        label="Auction Details"
                        label-size="lg"
                        label-class="font-weight-bold pt-0"
                        class="mb-0">
            <b-form-group horizontal
                          label="Title:"
                          label-class="text-sm-right"
                          label-for="nestedStreet">
              <b-form-input id="nestedStreet" v-model="titleOfNewAuction"></b-form-input>
            </b-form-group>
            <b-form-group horizontal
                          label="Start Date:"
                          label-class="text-sm-right"
                          label-for="nestedCity">
              <b-form-input id="nestedCity" type="date" v-model="startDateOfNewAuction"></b-form-input>
            </b-form-group>
            <b-form-group horizontal
                          label="End Date:"
                          label-class="text-sm-right"
                          label-for="nestedState">
              <b-form-input id="nestedState" v-model="endDateOfNewAuction" type="date"></b-form-input>
            </b-form-group>

            <b-form-group horizontal
                          label="Auction Photo:"
                          label-class="text-sm-right"
                          label-for="nestedState">


              <div id="app">
                <input type="file" @change="onFileChanged">

              </div>
            </b-form-group>


            <b-form-group horizontal
                          label="Category:"
                          label-class="text-sm-right"
                          label-for="nestedCountry">
              <b-form-select v-model="categoryOfNewAuction" :options="options" class="mb-3"/>
              <div>Selected: <strong>{{ categoryOfNewAuction }}</strong></div>

            </b-form-group>


          </b-form-group>
          <b-form-textarea id="textarea1"
                           v-model="descriptionOfNewAuction"
                           placeholder="Enter description of auction..."
                           :rows="3"
                           :max-rows="6">
          </b-form-textarea>

          <button type="submit" class="btn btn-primary" @click="createAuction" id="logInButton">Create</button>

<div v-if = "creationComplete"> {{creationCompleteMsg}} </div>

        </b-card>
      </b-modal>

    </div>

    <!-- User Interface controls -->
    <b-row>

      <b-form-group horizontal label="" class="mb-0">
        <b-input-group>
          <b-form-input v-model="filter" placeholder="Type to Search"/>
          <b-input-group-append>
            <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
    </b-row>

    <!-- Main table element -->
    <b-table show-empty
             stacked="md"
             :items="this.auctionsToShow"
             :fields="fields"

             :filter="filter"
             :sort-by.sync="sortBy"
             :sort-desc.sync="sortDesc"
             @filtered="onFiltered"
    >
      <!--  <template slot="name" slot-scope="row">{{row.value.first}} {{row.value.last}}</template>-->
      <!--<template slot="isActive" slot-scope="row">{{row.value?'Yes :)':'No :('}}</template>-->

    </b-table>


    <!-- Info modal -->
    <!-- <b-modal id="modalInfo" @hide="resetModal" :title="modalInfo.title" ok-only>
       <pre>{{ modalInfo.content }}</pre>
     </b-modal>-->




  </b-container>


</template>

<script>


  export default {
    data() {
      return {
        creationComplete: false,
        creationCompleteMsg: 'Auction Created! :D',
        show: false,
        error: "",
        errorMessage: "",
        myWonAuctions: null,
        errorFlag: false,
        auctions: [],
        auction: {},
        auctionsToShow: [],
        bids: [],
        categories: [],
        selectedCategory: "All Categories",
        selectedState: "All Auctions",
        testMessage: "leggo",
        searchBarInput: "",
        text: '',
        /*items: items,*/
        fields: [
          {key: 'title', label: 'Auction Title', sortable: true},
          {key: 'id', label: 'Auction ID', sortable: true, 'class': 'text-center'},
          {key: 'trueStart', label: ' Start Date', sortable: true},
          {key: 'trueEnd', label: ' End Date', sortable: true},
        ],

        sortBy: null,
        sortDesc: false,
        filter: null,

        options: [
          {value: 1, text: 'Apparel'},
          {value: 2, text: 'Equipment'},
          {value: 3, text: 'Property'},
          {value: 4, text: 'Vehicles'},
          {value: 5, text: 'Other'}
        ],


        //creating new auction
        endDateOfNewAuction: '',
        startDateOfNewAuction: '',
        categoryOfNewAuction: null,
        photoOfNewAuction: null,
        titleOfNewAuction: '',
        selectedFile: null,
        descriptionOfNewAuction: "",
        startDateAsEpoch: 0,
        endDateAsEpoch: 0


      }
    },

    mounted: function () {
      console.log('here');
      this.creationComplete = false;
      if (this.$route.params.auction_id) {
        this.getSingleAuction(this.$route.params.auction_id);
        console.log("now here");
        this.getBids(this.$route.params.auction_id);
        console.log("now here2");
        this.getCategories();
      } else {
        this.getAuctions();
        /*this.getActiveAuctions();*/
        /*this.getWonAuctions();
        this.getUpcomingAuctions();
        this.getExpiredAuctions();
        this.getCategories();*/
      }

    },


    methods: {

      onFileChanged(event) {
        this.selectedFile = event.target.files[0];
        this.selectedFileType = event.target.files[0].type;
      },

      onUpload(auctionID) {
        // upload file, get it from this.selectedFile
        this.$http.post(
          'http://localhost:4941/api/v1/auctions/' + auctionID + '/photos',
          this.selectedFile,
          {
            headers: {
              "X-Authorization": localStorage.getItem("userToken"),
              "Content-Type": this.selectedFileType
            }
          }).then(response => {
          this.photoOfNewAuction = response.data;
          localStorage.setItem("auctionPhoto", this.photoOfNewAuction);
          console.log("success222")
        }, response => {
          // error callback
          console.log("error")
        });
      },


      /* <!-- ---------------------------------------------------------------------------------------------------------- -->
       <!-- SHOW CATEGORIES -->
       <!-- ---------------------------------------------------------------------------------------------------------- -->*/

      categoryApparel: function () {
        /*this.getAuctions();*/
        var auctionsCopy = this.auctions;
        this.auctions = [];
        for (var key in auctionsCopy) {
          if (auctionsCopy[key].categoryId == 1) {
            this.auctions.push(auctionsCopy[key]);
          }

        }
        this.selectedCategory = 'apparel';
        console.log("cat apparel");
      },

      categoryEquipment: function () {
        /*this.getAuctions();*/
        var auctionsCopy = this.auctions;
        this.auctions = [];
        for (var key in auctionsCopy) {
          if (auctionsCopy[key].categoryId == 2) {
            this.auctions.push(auctionsCopy[key]);
          }
        }
        this.selectedCategory = 'equipment';
        console.log("cat equ");
      },

      categoryProperty: function () {
        /*this.getAuctions();*/
        var auctionsCopy = this.auctions;
        this.auctions = [];
        for (var key in auctionsCopy) {
          if (auctionsCopy[key].categoryId == 4) {
            this.auctions.push(auctionsCopy[key]);
          }
        }
        this.selectedCategory = 'property';
        console.log("cat prop");
      },

      categoryVehicles: function () {
        /*this.getAuctions();*/
        var auctionsCopy = this.auctions;
        this.auctions = [];
        for (var key in auctionsCopy) {
          if (auctionsCopy[key].categoryId == 3) {
            this.auctions.push(auctionsCopy[key]);
          }
        }
        this.selectedCategory = 'vehicles';
        console.log("cat vehicle");
      },

      categoryOther: function () {
        /*this.getAuctions();*/
        var auctionsCopy = this.auctions;
        this.auctions = [];
        for (var key in auctionsCopy) {
          if (auctionsCopy[key].categoryId == 5) {
            this.auctions.push(auctionsCopy[key]);
          }
        }
        this.selectedCategory = 'other';
        console.log("cat otHEr");
      },

      /*  <!-- ---------------------------------------------------------------------------------------------------------- -->
        <!-- CONVERT EPOCH TO DATE -->
        <!-- ---------------------------------------------------------------------------------------------------------- -->*/

      convertDateTime: function (epochstamp) {
        var date = new Date(epochstamp);

        return date.toLocaleDateString("en-US");
      },

      /*  <!-- ---------------------------------------------------------------------------------------------------------- -->
        <!-- GET AUCTIONS -->
        <!-- ---------------------------------------------------------------------------------------------------------- -->*/

      getAuctions: function () {
        console.log("testgetaucton");
        this.$http.get('http://localhost:4941/api/v1/auctions')
          .then(function (response) {
            this.auctions = response.data;
            for (var key in this.auctions) {
              console.log(this.auctions[key]);
              this.auctions[key].shown = true;
              console.log("--------------------------------");
              console.log(this.auctions[key].trueStart = this.convertDateTime(this.auctions[key].startDateTime));
              console.log(this.auctions[key].trueEnd = this.convertDateTime(this.auctions[key].endDateTime));
              console.log("--------------------------------");
              console.log(this.auctions[key]);
              this.selectedState = "All Auctions";
              this.selectedCategory = "All Categories";
            }

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });

      },


      getActiveAuctions: function () {
        console.log("testgetauctonACTIVE");
        this.$http.get('http://localhost:4941/api/v1/auctions?status=active')
          .then(function (response) {
            /*this.activeAuctions = response.data;
            for(var key in this.auctions){
              //iterate through current list of all auctions
              console.log("YEYEYEYE");
              this.auctions[key].shown = false;
            //set state of all to false, will set only desired to true
              for(var key2 in this.activeAuctions) {
                //iterate trough list of active auctions
                if (this.auctions[key].id == this.activeAuctions[key2].id) {
                  //if auction is found in active auctions, shown set to true
                  this.auctions[key].shown = false;
                }

              }
              console.log("Auction identified as ACTIVEeeeee");
              console.log(this.auctions[key]);

            }*/

            this.auctions = response.data;
            console.log(this.auctions);
            this.selectedState = "Active Auctions";
            this.selectedCategory = "All Categories";

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });

      },

      getExpiredAuctions: function () {
        console.log("testgetauctonEXPIRED");
        this.$http.get('http://localhost:4941/api/v1/auctions?status=expired')
          .then(function (response) {


            this.auctions = response.data;

            console.log(this.auctions);
            this.selectedState = "Expired Auctions";
            this.selectedCategory = "All Categories";

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });

      },


      getWonAuctions: function () {
        console.log("testgetauctonWON");
        this.$http.get('http://localhost:4941/api/v1/auctions?status=won')
          .then(function (response) {
            this.wonAuctions = response.data;
            for (var key in this.wonAuctions) {
              console.log("Auction identified as WON");
              console.log(this.auctions[key]);

            }

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });

      },


      getUpcomingAuctions: function () {
        console.log("testgetauctonUPCOMING");
        this.$http.get('http://localhost:4941/api/v1/auctions?status=upcoming')
          .then(function (response) {
            this.upcomingAuctions = response.data;
            for (var key in this.upcomingAuctions) {
              console.log("Auction identified as UPCOMING");
              console.log(this.auctions[key]);

            }

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });

      },

      getAuctionByName: function () {
        console.log("retrieving auction by search parameter");
        // should i get the input string internally or pass as parameter
        var interimAuctions = [];
        for (var key in this.auctions) {
          if (this.auctions[key].title.includes(this.searchBarInput)) {
            //now set the shown status of all auctions WITHOUT the substring to false
            interimAuctions.push(this.auctions[key]);
          }
        }
        this.auctions = interimAuctions;

      },

      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length;
        this.currentPage = 1
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

      /*    <!-- ---------------------------------------------------------------------------------------------------------- -->
          <!-- GET BIDS -->
          <!-- ---------------------------------------------------------------------------------------------------------- -->*/

      getBids: function (bid_id) {
        console.log("testgetaucton");
        this.$http.get('http://localhost:4941/api/v1/auctions/' + bid_id + '/bids')
          .then(function (response) {
            this.bids = response.data;

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          })
      },

      /*      <!-- ---------------------------------------------------------------------------------------------------------- -->
            <!-- GET CATEGORIES -->
            <!-- ---------------------------------------------------------------------------------------------------------- -->*/

      getCategories: function (bid_id) {
        console.log("testgetaucton");
        this.$http.get('http://localhost:4941/api/v1/categories')
          .then(function (response) {
            this.categories = response.data;

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          })
      },

      createAuction: function () {

        this.startDateAsEpoch = new Date(this.startDateOfNewAuction).getTime();
        this.endDateAsEpoch = new Date(this.endDateOfNewAuction).getTime();


        this.$http.post('http://localhost:4941/api/v1/auctions', JSON.stringify({
          "categoryId": this.categoryOfNewAuction,
          "title": this.titleOfNewAuction,
          "description": this.descriptionOfNewAuction,
          "startDateTime": this.startDateAsEpoch,
          "endDateTime": this.endDateAsEpoch,
          "reservePrice": 100,
          "startingBid": 10
        }), {headers: {"X-Authorization": localStorage.getItem("userToken")}})
          .then(function (response) {
            this.creationComplete = true;
            this.auctID = response.data;
            console.log("suc");
            console.log(this.auctID.id);
            this.onUpload(this.auctID.id);

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
            //add code for error
          })
      },

      getMyWonAuctions: function () {
        console.log("getting my won");

        this.$http.get('http://localhost:4941/api/v1/my_won_auctions/', {headers: {"X-Authorization": localStorage.getItem("userToken")}})
          .then(function (response) {
            this.auctionsToShow = response.data;
            for (var key in this.auctionsToShow) {
              console.log(this.auctionsToShow[key]);
              this.auctionsToShow[key].shown = true;
              console.log("--------------------------------");
              console.log(this.auctionsToShow[key].trueStart = this.convertDateTime(this.auctionsToShow[key].startDateTime));
              console.log(this.auctionsToShow[key].trueEnd = this.convertDateTime(this.auctionsToShow[key].endDateTime));
              console.log("--------------------------------");
              console.log(this.auctionsToShow);
              console.log('sukcesss');
            }
            console.log(this.auctionsToShow);
            console.log('sukcesss');
          }, function (error) {

            this.error = error;
            this.errorFlag = true;
            this.errorMessage = "Failed :("
          })
      },


      getMyBidAuctions: function () {
        console.log("getting my bid");

        this.$http.get('http://localhost:4941/api/v1/auctions?bidder=' + localStorage.getItem("userID"), {headers: {"X-Authorization": localStorage.getItem("userToken")}})
          .then(function (response) {
            this.auctionsToShow = response.data;
            for (var key in this.auctionsToShow) {
              console.log(this.auctionsToShow[key]);
              this.auctionsToShow[key].shown = true;
              console.log("--------------------------------");
              console.log(this.auctionsToShow[key].trueStart = this.convertDateTime(this.auctionsToShow[key].startDateTime));
              console.log(this.auctionsToShow[key].trueEnd = this.convertDateTime(this.auctionsToShow[key].endDateTime));
              console.log("--------------------------------");
              console.log(this.auctionsToShow);
              console.log('sukcesss');
            }
            console.log(this.auctionsToShow);
            console.log('sukcesss');
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
            this.errorMessage = "Failed :("
          })
      },


      getMySellingAuctions: function () {
        console.log("getting my sell");

        this.$http.get('http://localhost:4941/api/v1/auctions?seller=' + localStorage.getItem("userID"), {headers: {"X-Authorization": localStorage.getItem("userToken")}})
          .then(function (response) {
            this.auctionsToShow = response.data;
            for (var key in this.auctionsToShow) {
              console.log(this.auctionsToShow[key]);
              this.auctionsToShow[key].shown = true;
              console.log("--------------------------------");
              console.log(this.auctionsToShow[key].trueStart = this.convertDateTime(this.auctionsToShow[key].startDateTime));
              console.log(this.auctionsToShow[key].trueEnd = this.convertDateTime(this.auctionsToShow[key].endDateTime));
              console.log("--------------------------------");
            console.log(this.auctionsToShow);
            console.log('sukcesss');
            }
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
            this.errorMessage = "Failed :("
          })
      },


      // apparently NOT WORKING ???? :O:O:O:O:O:O:OL:O
      getMyCompleteAuctions: function () {
        console.log("getting my complete");
        this.auctionsToShow = [];
        this.$http.get('http://localhost:4941/api/v1/auctions?seller=' + localStorage.getItem("userID") + '&status=won', {headers: {"X-Authorization": localStorage.getItem("userToken")}})
          .then(function (response) {
            this.auctionsToShow = response.data;
            for (var key in this.auctionsToShow) {
              console.log(this.auctionsToShow[key]);
              this.auctionsToShow[key].shown = true;
              console.log("--------------------------------");
              console.log(this.auctionsToShow[key].trueStart = this.convertDateTime(this.auctionsToShow[key].startDateTime));
              console.log(this.auctionsToShow[key].trueEnd = this.convertDateTime(this.auctionsToShow[key].endDateTime));
              console.log("--------------------------------");
              console.log(this.auctionsToShow);
              console.log('sukcesss');
            }
            console.log(this.myWonAuctions);
            console.log('sukcesss');
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
            this.errorMessage = "Failed :("
          })
      },


      getMyFailedAuctions: function () {
        console.log("getting my failed");
this.auctionsToShow = [];
        this.$http.get('http://localhost:4941/api/v1/auctions?seller=' + localStorage.getItem("userID") + '&status=expired', {headers: {"X-Authorization": localStorage.getItem("userToken")}})
          .then(function (response) {
            this.auctionsToShow = response.data;
            for (var key in this.auctionsToShow) {
              console.log(this.auctionsToShow[key]);
              this.auctionsToShow[key].shown = true;
              console.log("--------------------------------");
              console.log(this.auctionsToShow[key].trueStart = this.convertDateTime(this.auctionsToShow[key].startDateTime));
              console.log(this.auctionsToShow[key].trueEnd = this.convertDateTime(this.auctionsToShow[key].endDateTime));
              console.log("--------------------------------");
              console.log(this.auctionsToShow);
              console.log('sukcesss');
            }
            console.log(this.myWonAuctions);
            console.log('sukcesss');
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
            this.errorMessage = "Failed :("
          })
      },
    },
  }

</script>
