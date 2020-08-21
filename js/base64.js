(function(w,d){
    var id = 1; // 此id无实在意义，仅为操作id
    w.Base64 = function(imgFile, ele, width, height){
        id ++;
        this.imgFile = imgFile;
        this.id = id;
        this.width = width || 200;
        this.height = height || 200;
        
    };
    
})(window,document);

	


