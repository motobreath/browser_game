fs=require("fs")
console.log("INIT")
fs.readdir("/", function(err, items){   
   for(var i = 0; i < items.length-1; i++){
        (function(i){
            fs.stat("/" + items[i], function(err, stats) {
                
                if(stats.isDirectory()){
                    console.log('dir found: ' + items[i] + ' index: ' + i);
                }else{
                    console.log('file found: ' + items[i] + ' index: ' + i);
                }
            });
        })(i);
   }
});