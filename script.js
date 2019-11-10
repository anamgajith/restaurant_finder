var restaurant = function(name,location,cuisines,url,image){
    this.name = name
    this.location = location
    this.cuisines = cuisines
    this.url = url
    this.image = image
}

var ViewModel = function(){
    var self = this
    this.userkey = "2dcdd97d88059258fd93b1c1bd576ec8"
    this.city = ko.observable("")
    this.city_id = ko.observable(0)
    this.restaurants = ko.observableArray()
    this.errorstatus = ko.observable(false)
    this.resultStatus = ko.observable(false)
    this.resultText = ko.observable("")
    this.getCityId = function(){
        if(self.city() == ""){
            self.errorstatus(true)
            self.resultSatus(false)
            return
        }
        self.errorstatus(false)
        this.xhr = new XMLHttpRequest()
        this.xhr.addEventListener("readystatechange",function(event){
            if(this.readyState == 4){
                j =JSON.parse(this.responseText)
                self.city_id(j.location_suggestions[0].city_id)
                self.getRestaurants()
            }
        });
        this.xhr.open("GET","https://developers.zomato.com/api/v2.1/locations?query="+self.city());
        this.xhr.setRequestHeader("user-key",self.userkey)
        this.xhr.send(null)
    }
    this.getRestaurants = function(){
        this.xhr = new XMLHttpRequest()
        this.xhr.addEventListener("readystatechange",function(event){
            if(this.readyState == 4){
                j =JSON.parse(this.responseText)
                self.restaurants.removeAll()
                j.restaurants.forEach(element => {
                    self.restaurants.push(new restaurant(element.restaurant.name,element.restaurant.location.address,
                        element.restaurant.cuisines,element.restaurant.url,element.restaurant.featured_image))
                });
                self.resultText("Total "+self.restaurants().length+" restaurants found")
                self.resultStatus(true)
                self.city("")
                self.city_id(0)
            }
        });
        this.xhr.open("GET","https://developers.zomato.com/api/v2.1/search?entity_id="+self.city_id()+"&entity_type=city")
        this.xhr.setRequestHeader("user-key",self.userkey)
        this.xhr.send(null)
    }
}

ko.applyBindings(new ViewModel())