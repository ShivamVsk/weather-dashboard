document.addEventListener('DOMContentLoaded',function () {
    console.log("Document loaded") ;
    const bodydiv = document.querySelector("body") ;
    const inputbut = document.getElementById("inputbut") ;
    const getcurrlocbut = document.getElementById("getcurrlocbut") ;
    const celciusbut = document.getElementById("celciusbut");
    const fahrenbut = document.getElementById("Fahrenbut") ;
    const darkmodebut = document.getElementById("darkmodebut") ;
    const lightmodebut = document.getElementById("lightmodebut") ;
    const locat = document.getElementById("locat")
    const maindiv = document.getElementById("main") ;
    const search_but = document.querySelector(".search_button") ;
    const star = document.querySelector(".star"); 
    bodydiv.classList.add("light_th") ;
    lightmodebut.style.backgroundColor = "white" 
    let latitude = undefined;
    let longitude = undefined;
    let temp_unit = ["&units=metric","°C"] ; // initially celcius unit 
    let current_day_item_div ;
    const favorites_list = [] ;
    let favindex = -1 ;
    let currentloc = "" ;
    search_but.addEventListener('click', () => console.log("Serach button is clicked")) ;
    //Create a div and attach all nodes to its and attach that div to the body at the last 
    async function getcurrentweather() {
        try{
            const currenweatherdataurl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=346892741660357f3135aca487e6c943${temp_unit[0]}`;
            const forecastweatherdataurl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=346892741660357f3135aca487e6c943${temp_unit[0]}` ;
            const response = await fetch(currenweatherdataurl) ;    
            if(!response.ok) {
                throw(error) ;
            }
            const data = await response.json() ;
            //show current location
            currentloc = `${data.name}, ${data.sys.country}` ;
            const locattext = `<li><span class="material-symbols-outlined">location_on</span><p>${"  "}${currentloc}</p></li>`; 
            locat.innerHTML = locattext ;

            star.style.display = "block" ;
            star.classList.remove("starfill") ;
            /////Checking whether the current location is in my favorite list 
            for(let i = 0 ; i < favorites_list.length ; i++) {
                if(favorites_list[i].loc === currentloc) {
                    const latdiff = Math.abs(latitude.toFixed(3) - favorites_list[i].lat.toFixed(3));
                    const londiff = Math.abs(longitude.toFixed(3) - favorites_list[i].lon.toFixed(3)) ;
                    if((latdiff <= 0.001) && (londiff <= 0.001)) {
                        star.classList.add("starfill") ;
                    }
                }
            }

            /////

            //maindiv.innerHTML = "<p id = \"curweat\">Current Weather</p>"
            
            //showing current time 
            const getlocationtime = function(location_timezone) {
                const date = new Date() ;
                const wrtutctime = date.getTime() + date.getTimezoneOffset()*60000 ;
                const current_time = new Date(wrtutctime + location_timezone*1000) ;
                return current_time.toLocaleTimeString() ;
            }
            let elem = document.getElementById("current_time");
            elem.textContent = getlocationtime(data.timezone) ;

            //showing icon 
            const curweathericon = data.weather[0].icon ;
            const iconurl = `https://openweathermap.org/img/wn/${curweathericon}@2x.png` ;
            elem = document.getElementById("icon_img") ;
            elem.src = iconurl ;
            
            //showing temp and weather 
            elem = document.getElementById("cur_temp") ;
            elem.textContent = Math.round(data.main.temp) + temp_unit[1] ;
            elem = document.getElementById("cur_sky") ;
            elem.textContent = data.weather[0].main ;
            elem = document.getElementById("cur_feels_like") ;
            elem.textContent =`Feels like : ${Math.round(data.main.feels_like)}${temp_unit[1]}`;

            //showing weather description 
            elem = document.getElementById("weather_descr") ;
            elem.textContent = "Weather description : " + data.weather[0].description ;

            //showing other para
            document.getElementById("min_temp").textContent = "Min temp : " + Math.round(data.main.temp_min) + temp_unit[1]; 
            document.getElementById("max_temp").textContent = "Max temp : " + Math.round(data.main.temp_max) + temp_unit[1];

            document.getElementById("hpress").textContent = "Pressure" ;
            console.log("hpress" + document.getElementById("hpress").textContent) ;
            document.getElementById("ppress").textContent = data.main.pressure + "hPa" ;
            
            document.getElementById("hhumid").textContent = "Humidity";
            document.getElementById("phumid").textContent =  data.main.humidity + "%" ;
            
            // document.getElementById("hseal").textContent = "Sea lvl" ;
            // document.getElementById("pseal").textContent = data.main.sea_level + "hPa" ;

            // document.getElementById("hgndl").textContent = "Ground lvl" ;
            // document.getElementById("pgndl").textContent = data.main.grnd_level + "hPa" ;

            document.getElementById("hvis").textContent = "Visibility" ;
            document.getElementById("pvis").textContent = data.visibility + "m";

            document.getElementById("hwind").textContent = "Wind"
            document.getElementById("pwind").textContent = data.wind.speed + "m/s";
            data.deg 
            data.gust

            document.getElementById("hcld").textContent = "Clouds" ;
            document.getElementById("pcld").textContent = data.clouds.all + "%";

            let temp ;
            temp = new Date((data.sys.sunrise + data.timezone)*1000)  ;
            document.getElementById("hsunr").textContent = "Sunrise" ;
            document.getElementById("psunr").textContent = temp.toUTCString().split(' ')[4] ;
            
            temp = new Date((data.timezone + data.sys.sunset)*1000) ;
            document.getElementById("hsuns").textContent = "Sunset" ;
            document.getElementById("psuns").textContent =  temp.toUTCString().split(' ')[4] ;

            //3hr 5 day forecast \
            const forecasturl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=346892741660357f3135aca487e6c943${temp_unit[0]}`;
            const forecast_response = await fetch(forecasturl) ;    
            if(!response.ok) {
                throw(error) ;
            }
            const forecast_data = await forecast_response.json() ;
            const forecast_list = forecast_data.list ;
            console.log(forecast_data) ;

            let htmlstring = "" ;
            const forecast_array = [] ;
            let array_index = -1 ;
            let offset = 0 ;
            let len = 0 ;
            let day_div_innerhtml = "" ;
            for(let i = 0 ; i < forecast_list.length ; i++) {
                
                const date = forecast_list[i].dt_txt.substring(8,10) + "/" +  forecast_list[i].dt_txt.substring(5,7); 
                const time = forecast_list[i].dt_txt.substring(11,16) ;
                // console.log(date +" " + time) ;
                if(offset == 0) {
                    array_index ++ ;
                    forecast_array.push({"day" : "", "day_html" : "","hour_html":""}) ;
                    forecast_array[array_index].day = date ;
                }
                offset ++ ;
                const imglink = `https://openweathermap.org/img/wn/${forecast_list[i].weather[0].icon}@2x.png` ;
                htmlstring = `<div>
                    <ul>
                        <li>${forecast_list[i].dt_txt.substring(11,16)}</li>
                        <li><img src="${imglink}"></li>
                        <li><p>${Math.round(forecast_list[i].main.temp)} ${temp_unit[1]}</li>
                        <li>${forecast_list[i].weather[0].main}</li>
                        <li><span class="material-symbols-outlined">device_thermostat</span><p>${Math.round(forecast_list[i].main.feels_like)} ${temp_unit[1]}</li>
                        <li><span class="material-symbols-outlined">air</span><p>${forecast_list[i].wind.speed}m/s</p></li>
                        <li><span class="material-symbols-outlined">humidity_percentage</span><p>${forecast_list[i].main.humidity}%</p></li>
                    </ul>
                </div>` ;
                forecast_array[array_index].hour_html += htmlstring ; 
                if(time === "21:00" || ((len + offset) === forecast_list.length)) {
                    const ind = len + Math.floor(offset/2) ;
                    // console.log(ind) ;
                    len = len + offset ;
                    forecast_array[array_index].day_html = `
                    <div id = "day_item${array_index}">
                        <ul>
                            <li>${date}</li>
                            <li>
                                <img src="https://openweathermap.org/img/wn/${forecast_list[ind].weather[0].icon}@2x.png">
                                <ul>
                                    <li>${Math.round(forecast_list[ind].main.temp_max)}${temp_unit[1]}</li>
                                    <li>${Math.round(forecast_list[ind].main.temp_min)}${temp_unit[1]}</li>
                                </ul>
                            </li>
                            <li> ${forecast_list[ind].weather[0].main}</li>
                        </ul>
                    </div>` ;

                    forecast_array[array_index].day = date ;
                    offset = 0 ;
                    day_div_innerhtml += forecast_array[array_index].day_html ;
                }
            }
            console.log(forecast_array) ;
            const day_cards_div = document.querySelector(".day_cards") ;
            day_cards_div.innerHTML = day_div_innerhtml ;
            const hour_cards_div = document.querySelector(".hour_cards") ;
            hour_cards_div.innerHTML = "" ;
            current_day_item_div = undefined ;
            for(let i = 0 ; i < forecast_array.length ; i++) {
                    const day_item_div = document.getElementById(`day_item${i}`) ;
                    day_item_div.addEventListener('click',function(event) {
                        console.log("div is clicked " + day_item_div.id) ;
                        hour_cards_div.innerHTML = forecast_array[Number(day_item_div.id.substring(8))].hour_html ; 
                    }) ;
            }

            ///////////
        }
        catch(error){
            console.log(`Error : ${error}`) ;
        }
    }
    getcurrlocbut.addEventListener('click',function () {
        if(!navigator.geolocation) {
            locat.textContent = "Your browser do not support Geolocation" ;
            return ;
        }
        else {
            locat.textContent = "Locating .."
        }
        async function successCallback(GeolocationPosition) {
            console.log("Location fetched successfully ") ;
            latitude = GeolocationPosition.coords.latitude ;
            longitude = GeolocationPosition.coords.longitude ;
            await getcurrentweather() ;
        }
        function errorCallback(GeolocationPositionError) {
            locat.textContent = "Failed to fetch location" ;
        }
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback); 
    }) ;
    let arr = [] ; 
    search_but.addEventListener('click',async function() {
        const input_field = document.querySelector(".search_input");
        const input_text = input_field.value ;
        if(input_text === "") {
            return ;
        }
        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${input_text}&limit=5&appid=346892741660357f3135aca487e6c943${temp_unit[0]}`;
        const result  = await fetch(url) ;
        const data = await result.json() ;
        // console.log(data) ;
        let list = "" ;
        arr = data ;
        if(arr.length === 0) return ;
        for(let i = 0 ; i < arr.length ; i++) {
            let name = arr[i].name + ","; if(arr[i].name === undefined) name = "" ;
            let state = arr[i].state + "," ; if(arr[i].state === undefined) state = "" ;
            let country = arr[i].country ;

            const item = `${name} ${state} ${country}` ;
            list = list + `<li id = "${i}"><span class="material-symbols-outlined">location_on</span>  ${item}</li>`;
        }
        // console.log(list) ;
        const ulist = document.querySelector(".list") ;
        ulist.innerHTML = list ;

        ulist.addEventListener('click',async function(event) {
            const index = event.target.id ;
            if(index === "") {
                console.log("click on ul ") ;
                return ;
            }
            longitude = arr[Number(index)].lon ;
            latitude = arr[Number(index)].lat ;
            ulist.innerHTML = "" ;
            //sugggestions_field.style.zIndex = -1 ;
            input_field.value = "" ;
            await getcurrentweather() ;
        });
    }) ;

    celciusbut.addEventListener('click', async function() {
        if((latitude == undefined) && (longitude == undefined)) return ;
        if(temp_unit[0] == "&units=metric") {
            return ;
        }
        else{
            temp_unit[0] = "&units=metric" ;
            temp_unit[1] = "°C" ; 
        }
        await getcurrentweather() ;
    }) ;
    fahrenbut.addEventListener('click', async function() {
        if((latitude == undefined) && (longitude == undefined)) return ;
        if(temp_unit[0] == "&units=imperial") {
            return ;
        }
        else{
            temp_unit[0] = "&units=imperial" ;
            temp_unit[1] = "°F" ;
        }
        await getcurrentweather() ;
    }) ;
    //adding favorite add and removing 
            const favorite_div = document.querySelector(".favorites") ;
            let favlistener ;
            star.addEventListener('click',function() {
                if(star.classList.contains("starfill")) {
                    for(let i = 0 ; i < favorites_list.length ; i++) {
                        if(favorites_list[i].loc === currentloc) {
                            if((latitude === favorites_list[i].lat) && (longitude === favorites_list[i].lon)) {
                                const temp = document.getElementById(favorites_list[i].id) ;
                                temp.removeEventListener('click', favlistener) ;
                                favorite_div.removeChild(temp) ;
                                favorites_list.splice(i,1);
                                star.classList.remove("starfill") ;
                            }
                        }
                    }
                }
                else {
                    let favobj = {id : undefined , loc : undefined, lat:undefined, lon:undefined} ;
                    favindex = favindex + 1 ;
                    divno = favindex ;
                    favobj.id = `favorite${divno}` ;
                    favobj.loc =  `${currentloc}` ;
                    favobj.lat = latitude ;
                    favobj.lon = longitude ;
                    // console.log(favobj) ;
                    favorites_list.push(favobj) ;
                    const favorite_item = document.createElement("div") ;
                    favorite_item.setAttribute("id",favobj.id) ;
                    favorite_item.innerHTML = `<ul>
                            <li><span class="material-symbols-outlined">location_on</span></li>
                            <li>${currentloc}</li>
                        </ul>` ;
                    favorite_div.appendChild(favorite_item) ;
                    star.classList.add("starfill") ;
                    favlistener = async function() {
                        for(let i = 0 ; i < favorites_list.length ; i++) {
                            if(favorites_list[i].id === favorite_item.id) {
                                    divno = i ; 
                                    break ;
                            }
                        }
                        latitude = favorites_list[divno].lat ;
                        longitude = favorites_list[divno].lon ;
                        await getcurrentweather() ;
                        const curstar = document.querySelector(".star") ;
                        curstar.classList.add("starfill") ;
                    };
                    favorite_item.addEventListener(`click`, favlistener) ;
                }
                // console.log(favorites_list);                
            }) ;
            ///////////
            //////
            darkmodebut.addEventListener(`click`, function() {
                bodydiv.classList.remove("light_th") ;
                bodydiv.classList.add("dark_th") ;
                lightmodebut.style.backgroundColor = "rgba(255, 255, 255, 0.441) " ;
                darkmodebut.style.backgroundColor = "rgba(255, 255, 0, 0.5)" ;
            }) ;
            lightmodebut.addEventListener(`click`, function() {
                bodydiv.classList.add("light_th") ;
                bodydiv.classList.remove("dark_th") ;
                darkmodebut.style.backgroundColor = "rgba(255, 255, 255, 0.441) " ;
                lightmodebut.style.backgroundColor = "white" ;
            }) ;
            //////
});
