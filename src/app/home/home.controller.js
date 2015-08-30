(function() {
  'use strict';

  angular
    .module('company-insights')
    .controller('HomeController', HomeController);


  /** @ngInject */
  function HomeController(personalityInsight, news, sentiment) {

    var _this = this;
    this.mainCompany = null;
    this.chartData = [];
    this.news = [];
    this.sentiment = null;

    this.loading = {
      news: false,
      chart: false,
      sentiment: false
    };

    this.companyToCompare = null;
    this.companiesToCompare = [];

    this.existCompany = false;
    this.invalidCompany = false;
    this.limitExceeded = false;

    this.getNews = function(){
      this.loading.news = true;
      news
        .get(this.mainCompany)
        .then(function(data){
          _this.loading.news = false;
          _this.news = data;
        });
    };

    this.getSentiment = function(){
      this.loading.sentiment = true;
      sentiment
        .get(this.mainCompany)
        .then(function(data){
          _this.loading.sentiment = false;
          _this.sentiment = data;
        });
    };


    this.analyze = function(){
      this.loading.chart = true;
      var companies = [];
      companies.push(this.mainCompany);
      companies = companies.concat(this.companiesToCompare);

      personalityInsight
        .analyze(companies)
        .then(function(data){
          _this.loading.chart = false;
          _this.chartData = data;
        });

      this.getNews();
      this.getSentiment();
    };

    this.addCompanyToCompare = function(){
      if (this.companiesToCompare.length == 7) {
        this.limitExceeded = true;
      }
      else if (!this.companyToCompare) {
        this.invalidCompany = true;
      }
      else if (this.companiesToCompare.indexOf(this.companyToCompare) > -1) {
        this.existCompany = true;
      }
      else{
        this.companiesToCompare.push(this.companyToCompare);
        this.companyToCompare = null;
      }

    };

    this.validateCompany = function(){

      this.existCompany = false;
      this.invalidCompany = false;
      this.limitExceeded = false;

      if (this.companiesToCompare.length == 7) {
        this.limitExceeded = true;
      }
      else if (!this.companyToCompare) {
        this.invalidCompany = true;
      }
      else if (this.companiesToCompare.indexOf(this.companyToCompare) > -1) {
        this.existCompany = true;
      }

    };
  }
})();
