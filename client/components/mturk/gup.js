
//this function gets the mturk parameters from the current url
const Gup = (name)=> {
    //
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if(results == null)
        return "";
    else return unescape(results[1]);
}

export default Gup;