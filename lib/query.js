
exports.createQuery = function(){
   return new Query();
}

var Query = function(path){
   this.parameters = [];
   this.query = '';
}

Query.prototype.defType = function(type){
   var self = this;
   var parameter = 'defType=' + type;
   this.parameters.push(parameter);
   return self;
}

Query.prototype.dismax = function(){
   var self = this;
   var parameter = 'defType=dismax' ;
   this.parameters.push(parameter);
   return self;
}

Query.prototype.q = function(infos){
   var self = this;
   
   var parameter ='q=';
   if ( typeof(infos) === 'string' ){
      parameter += infos.split().join('+');
   }else{
      for(key in infos){
         parameter += key + ':' + infos[key] + ' ';
      }
   }
   this.parameters.push(parameter);
   return self;
}

Query.prototype.start = function(start){
   var self = this;
   var parameter = 'start=' + start ;
   this.parameters.push(parameter);
   return self;
}

Query.prototype.rows = function(rows){
   var self = this;
   var parameter = 'rows=' + rows ;
   this.parameters.push(parameter);
   return self;
}

Query.prototype.qf = function(fields){
   var self = this;
   var parameter = 'qf=' ;
   for(key in fields){
      parameter = parameter + key + '^' + fields[key] + ' ' ;
   }
   this.parameters.push(parameter);
   return self;
}

Query.prototype.mm = function(minimum){
   var self = this;
   var parameter = 'mm=' + minimum;
   this.parameters.push(parameter);
   return self;
}

Query.prototype.pf = function(fields){
   var self = this;
   var parameter = 'pf=' ;
   for(key in fields){
      parameter = parameter + key + '^' + fields[key] + ' ' ;
   }
   this.parameters.push(parameter);
   return self;
}

Query.prototype.ps = function(){}

Query.prototype.qs = function(){}

Query.prototype.tie = function(){}

Query.prototype.bq = function(){
   var self = this;
   var parameter = 'bq=' ;
   for(key in fields){
      parameter = parameter + key + '^' + fields[key] + ' ' ;
   }
   this.parameters.push(parameter);
   return self;
}

Query.prototype.bf = function(){}


Query.prototype.build = function(){
   return encodeURI(this.parameters.join('&'));
}
