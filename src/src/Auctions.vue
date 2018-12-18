<template>


  <div id="mainBlock">

    <div v-if="errorFlag" style="color: red;">
      {{error}}
    </div>

    <div v-if="$route.params.auction_id">
      <div id="auctions">
        <router-link :to="{ name: 'auctions'}">Back to Auction</router-link>

        <br/> <br/>


      </div>

      <!-- ---------------------------------------------------------------------------------------------------------- -->
      <!-- placeBid: Displays auction details -->
      <!-- ---------------------------------------------------------------------------------------------------------- -->

      <!-- <div class="modal fade" id="placeBid" tabindex="-1" role="dialog" aria-labelledby="placeBidLabel"
            aria-hidden="true">
         <div class="modal-dialog" role="document">
           <div class="modal-content">
             <div class="modal-header">
               <h5 class="modal-title" id="placeBidLabel">Place bid</h5>


               <span aria-hidden="true">&times;</span>

             </div>
             <div class="modal-body"> Enter amount and submit

              &lt;!&ndash; <div class="form-group">
                 <label for="exampleInputEmail1">Bid Amount:</label>
                 <input type="number" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                        placeholder="$$$">
                 <small id="emailHelp" class="form-text text-muted">note: your bid must be larger than {{bids[0].amount}} </small>
               </div>&ndash;&gt;

             </div>
             <div class="modal-footer">
               <button type="button" class="btn btn-secondary" data-dismiss="modal"> Close          </button>
               <button type="button" class="btn btn-secondary" data-dismiss="modal"> Submit          </button>
             </div>
           </div>
         </div>
       </div>-->
    </div>

    <div v-else>
      <div id="auction">


      <!--  <span class="badge badge-primary">Category: <span class="badge badge-light">{{selectedCategory}}</span></span>

        <span class="badge badge-primary">State: <span class="badge badge-light">{{selectedState}}</span></span>
-->

        <div class="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
          <div class="btn-group" role="group" aria-label="First group">
            <!--<button type="button" class="btn btn-secondary" v-on:click="getAuctions" aria-pressed="true">All</button>
            <button type="button" class="btn btn-secondary" v-on:click="getActiveAuctions" data-toggle="button">Active
            </button>
            <button type="button" class="btn btn-secondary" v-on:click="getExpiredAuctions">Expired</button>-->

            <div class="text-xs-center">

              <v-btn outline color="indigo" v-on:click="getAuctions">All Auctions</v-btn>

              <v-btn outline color="indigo" v-on:click="getActiveAuctions">Active Auctions</v-btn>

              <v-btn outline color="indigo" v-on:click="getExpiredAuctions">Expired Auctions</v-btn>

              <!--<v-btn outline fab color="teal">
                <v-icon>list</v-icon>
              </v-btn>

              <v-btn outline large fab color="indigo">
                <v-icon>edit</v-icon>
              </v-btn>-->

            </div>

          </div>

          <div>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </div>


          <div>
            <b-dropdown id="ddown-buttons" text="Select Category:" class="m-2"
                        @click="console.log('Opening category menu...')">

              <b-dropdown-item-button v-on:click="categoryApparel"> Apparel </b-dropdown-item-button>
              <b-dropdown-item-button v-on:click="categoryEquipment"> Equipment </b-dropdown-item-button>
              <b-dropdown-item-button v-on:click="categoryVehicles"> Vehicles </b-dropdown-item-button>
              <b-dropdown-item-button v-on:click="categoryProperty"> Property </b-dropdown-item-button>
              <b-dropdown-item-button v-on:click="categoryOther"> Other </b-dropdown-item-button>

            </b-dropdown>
          </div>

        </div>


        <v-container fluid grid-list-md>


          <v-data-iterator
            :loading="true"
            :items="auctions"
            :search="search"
            :rows-per-page-items="rowsPerPageItems"
            :pagination.sync="pagination"
            content-tag="v-layout"
            row
            wrap
          >
            <v-flex
              slot="item"
              slot-scope="props"
              xs12
              sm6
              md4
              lg3
            >


              <v-card>

                <v-card-title><h4>{{ props.item.title }}</h4></v-card-title>
                <v-divider></v-divider>
                <v-list>

                  <v-list-tile style="height: 200px">
                    <v-list-tile-content style="height: 200px; padding-top:60px">
                      <div id="imageDiv2">
                        <img class="center" width="100%" style="width: 100%; height: 100%; padding-left: 20px" v-bind:src="getPhoto( props.item.id ) ">
                      </div>
                    </v-list-tile-content>
                  </v-list-tile>

                  <button>
                    <router-link :to="{ name: 'auction', params: { auction_id: props.item.id}}"> Details
                    </router-link>
                  </button>



                </v-list>
              </v-card>
            </v-flex>
          </v-data-iterator>
        </v-container>


      </div>
    </div>
  </div>
</template>

<!-- ---------------------------------------------------------------------------------------------------------- -->
<!-- END OF SCRIPT -->
<!-- ---------------------------------------------------------------------------------------------------------- -->

<script>

  export default {
    data() {
      return {
        dropdown_font: ['Arial', 'Calibri', 'Courier', 'Verdana'],
        otherUsers: [],
        rowsPerPageItems: [4, 8, 12],
        pagination: {rowsPerPage: 4},
        error: "",
        errorFlag: false,
        search: '',
        auctions: [],
        auction: {},
        bids: [],
        currentlyShowingAuction: 0,
        categories: [],
        selectedCategory: "All Categories",
        selectedState: "All Auctions",
        testMessage: "leggo",
        searchBarInput: "",
        /*items: items,*/
        fields: [
          {key: 'title', label: 'Person Full name', sortable: true},
          {key: 'startDateTime', label: 'Start Time', sortable: true, 'class': 'text-center'},

        ],

        sortBy: null,
        sortDesc: false,
        filter: null,
      }
    },

    mounted: function () {
      console.log('Begin mounted...');
      /*if (this.$route.params.auction_id) {
        this.getSingleAuction(this.$route.params.auction_id);

        this.getBids(this.$route.params.auction_id);

        this.getCategories();
      } else {*/
        this.getAuctions();

      }

    ,


    methods: {

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
        console.log("Getting all auctions...");
        this.$http.get('http://localhost:4941/api/v1/auctions')
          .then(function (response) {
            this.auctions = response.data;
            for (var key in this.auctions) {

              this.auctions[key].shown = true;
              /*this.otherUsers.push(this.auctions[key].)*/

              this.selectedState = "All Auctions";
              this.selectedCategory = "All Categories";

            }

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });

      },

      getPhoto: function (auctionID) {
        return 'http://localhost:4941/api/v1/auctions/' + auctionID + '/photos';
      },


      getActiveAuctions: function () {
        console.log("test get auction ACTIVE");
        this.$http.get('http://localhost:4941/api/v1/auctions?status=active')
          .then(function (response) {

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
        console.log("test get auction EXPIRED");
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
        console.log("test get auction WON");
        this.$http.get('http://localhost:4941/api/v1/auctions?status=won')
          .then(function (response) {
            this.wonAuctions = response.data;
            for (var key in this.wonAuctions) {
              console.log("Following auction identified as WON:");
              console.log(this.auctions[key]);

            }

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });

      },


      getUpcomingAuctions: function () {
        console.log("test get auction UPCOMING");
        this.$http.get('http://localhost:4941/api/v1/auctions?status=upcoming')
          .then(function (response) {
            this.upcomingAuctions = response.data;
            for (var key in this.upcomingAuctions) {
              console.log("Following auction identified as UPCOMING:");
              console.log(this.auctions[key]);

            }

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });

      },

      getAuctionByName: function () {
        console.log("Retrieving auction by search parameter");

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


        localStorage.setItem("currentlyShowingAuction", id);
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

        this.$http.get('http://localhost:4941/api/v1/categories')
          .then(function (response) {
            this.categories = response.data;

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          })
      },


    },
  }

</script>



