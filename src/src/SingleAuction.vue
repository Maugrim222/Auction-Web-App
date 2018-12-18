<template>
  <div>


    <div id="error" v-if="errorFlag" style="background-color: red">
      <div>
        <v-alert v-model="alert" type="error" dismissible>
          Bid must be larger than previous bid - ${{auction.currentBid}}
        </v-alert>
      </div>
    </div>

    <div v-if="$route.params.auction_id">
      <div id="auctions">

        <br/> <br/>


        <div class="row mx-auto">

          <div class="card mb-3 ml-1" >


            <div id="imageDiv">
<!--                <img class="card-img-top" src="./assets/thephoto.png" alt="Card image cap">-->
                <img  alt="Card image cap" class="card-img-top" v-bind:src="getPhoto( $route.params.auction_id )" />

            </div>
            <div class="card-body">


              <h5 class="card-title">{{ auction.title }}</h5>



              <p class="card-text">   Description:          {{ auction.description }} </p>

              <p class="card-text">   Seller:               {{ auction.seller.username }} </p>
              <p class="card-text">   Start Date:           {{ convertDateTime(auction.startDateTime) }} </p>
              <p class="card-text">   End Date:             {{ convertDateTime(auction.endDateTime) }} </p>
              <p class="card-text">   Current Bid:          {{ auction.currentBid }} </p>


              <div v-if="this.userLoggedIn == 'true'">
                <b-btn v-b-modal.modal1  @click="getUserInfo(auction.seller.id)">View Seller Info</b-btn>

                <!-- Modal Component -->
                <b-modal id="modal1" title="Limited User Information">

                  <div class="modal-body">
                  <p class="my-4">  Given Name:              {{ this.sellerGivenName}} </p>
                  <p class="my-4">  Family Name:             {{ this.sellerFamilyName}} </p>
                  <p class="my-4">  Username:                {{ this.sellerUsername}} </p>
                  </div>



                </b-modal>
              </div>

              <p class="card-text" v-if="this.userLoggedIn == 'false'" >
                <small class="text-muted">You must be logged in to view seller information.</small>
              </p>

            </div>
          </div>

          <div class="col-sm-6">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Bid History</h5>
                <p class="card-text">Below is the bid history for this auction.</p>
                <table class="table table-striped">
                  <thead>

                  <tr>
                    <th scope="col">User</th>
                    <th scope="col">Bid</th>
                    <th scope="col">Time</th>
                  </tr>

                  </thead>
                  <tbody>

                  <tr v-if="bids" v-for="bid in bids">

                    <td> {{ bid.buyerUsername }} </td>
                    <td> {{ bid.amount }} </td>
                    <td> {{ convertDateTime(bid.datetime) }} </td>

                  </tr>
                  </tbody>
                </table>

                <button v-if="this.auctionBiddable" type="button" class="btn btn-primary" data-toggle="modal" data-target="#placeBid">
                  Place Bid
                </button>
<!--

                <b-button v-if="!this.auctionBiddable" disabled variant="outline-primary" class="btn btn-primary" data-toggle="modal" data-target="#placeBid">Bid</b-button>
                <b-button v-if="this.auctionBiddable" variant="outline-primary" class="btn btn-primary" data-toggle="modal" data-target="#placeBid">Bid biddabel</b-button>

-->


                <small v-if="!this.auctionBiddable" id="bidDisabled" class="form-text text-muted"> The auction has either completed or has not yet opened.</small>
                <small v-if="!this.auctionBiddable" id="bidDisabled2" class="form-text text-muted"> You must be logged in to place a bid </small>

              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- ---------------------------------------------------------------------------------------------------------- -->
      <!-- placeBid: Displays auction details -->
      <!-- ---------------------------------------------------------------------------------------------------------- -->


      <div class="modal fade" id="placeBid" tabindex="-1" role="dialog" aria-labelledby="placeBidLabel"
           aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="placeBidLabel">Place bid</h5>
              <span aria-hidden="true">&times;</span>

            </div>

           <!-- <b-alert :show="dismissCountDown"
                     dismissible
                     fade
                     variant="warning"
                     @dismissed="dismissCountDown=0"
                     @dismiss-count-down="countDownChanged">
              This alert will dismiss after {{dismissCountDown}} seconds...
            </b-alert>
-->
            <div class="modal-body"> Enter amount and submit

              <div class="form-group">
                <label for="exampleInputEmail1">Bid Amount:</label>
                <input type="number" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                       placeholder="$$$" v-model="bidAmount">
                <small id="emailHelp" class="form-text text-muted">note: your bid must be larger than {{auction.currentBid}} </small>
              </div>

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal"> Close          </button>
              <button type="button" class="btn btn-primary" @click="placeBid" data-dismiss="modal"> Submit          </button>
            </div>
          </div>
        </div>
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
        error: "",
        errorFlag: false,
        auctions: [],
        // should be []?
        auction: {},
        bids: [],
        categories: [],
        bidAmount: 0,
        sellerGivenName: "",
        sellerFamilyName: "",
        sellerUsername: "",
        userLoggedIn: false,
        triedBidFailed: false,
        dismissSecs: 5,
        dismissCountDown: 0,
        showDismissibleAlert: true,
        auctionBiddable: true,
        alert: true,
      }
    },

    mounted: function () {

      if (this.$route.params.auction_id) {
        this.getSingleAuction(this.$route.params.auction_id);

        console.log("this.auctionBiddable:::");
        console.log(this.auctionBiddable);


        this.getBids(this.$route.params.auction_id);

        this.getCategories();
        console.log("this.auctionBiddable:::");
        console.log(this.auctionBiddable);

        this.userLoggedIn = localStorage.getItem("userLoggedIn");




      } /*else {
        this.getAuctions();
        this.getCategories();

        if(console.log(localStorage.getItem("userLoggedIn"))){
          this.userLoggedIn = true;
      }

    }*/},



    methods: {

      checkAuctionBiddable: function(){
        let currentDate = Date.now();
        console.log("entered check biddable function");
        console.log("current date:::");
        console.log(currentDate);

        console.log("this.auction:::");
        console.log(this.auction);

        console.log("localStorage.getItem(\"userLoggedIn\"):::");
        console.log(localStorage.getItem("userLoggedIn"));

        console.log("auction start date is ..." + this.auction.startDateTime);
        if(currentDate < this.auction.startDateTime || currentDate > this.auction.endDateTime || localStorage.getItem("userLoggedIn") == 'false'){
          console.log("biddable set to false");
          this.auctionBiddable = false;
        }
      },

      getPhoto: function (auctionID) {
        return 'http://localhost:4941/api/v1/auctions/' + auctionID + '/photos';
      },


      countDownChanged (dismissCountDown) {
        this.dismissCountDown = dismissCountDown
      },
      showAlert () {
        this.dismissCountDown = this.dismissSecs
      },

      placeBid: function(id){

        this.$http.post('http://localhost:4941/api/v1/auctions/' + this.$route.params.auction_id + '/bids?amount=' + this.bidAmount, {}, {headers: {"X-Authorization": localStorage.getItem("userToken")}})
          .then(function (response) {
            this.auctions = response.data;
            this.getBids(this.$route.params.auction_id);


          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          })
      },


      getAuctions: function () {
        console.log("entered getAuctions");
        this.$http.get('http://localhost:4941/api/v1/auctions')
          .then(function (response) {
            this.auctions = response.data;


          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          })
      },


      convertDateTime: function (epochstamp) {
        var date = new Date(epochstamp);

        return date.toLocaleDateString("en-US");
      },


      getSingleAuction: function (id) {
        this.$http.get('http://localhost:4941/api/v1/auctions/' + id)
          .then(function (response) {
            this.auction = response.data;
            this.checkAuctionBiddable();

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },

      getBids: function (bid_id) {
        console.log("entered get bids");
        this.$http.get('http://localhost:4941/api/v1/auctions/' + bid_id + '/bids')
          .then(function (response) {
            this.bids = response.data;
            this.bids.reverse();

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          })
      },

      getCategories: function (bid_id) {
        console.log("entered get categories");
        this.$http.get('http://localhost:4941/api/v1/categories')
          .then(function (response) {
            this.categories = response.data;

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          })
      },

      getUserInfo(userID){
        this.user = [];
        console.log("Getting seller user data...");
        this.$http.get('http://localhost:4941/api/v1/users/' + userID, {headers: {"X-Authorization": localStorage.getItem("userToken")}})
          .then(function (response) {
            this.userseller = response.data;

            /*localStorage.setItem("userID", this.user.id);
            localStorage.setItem("userID", this.user.id);*/
            this.sellerUsername = this.userseller.username;
            this.sellerGivenName = this.userseller.givenName;
            this.sellerFamilyName = this.userseller.familyName;



          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          })
      }
    },
  }

</script>



