const TYPE_LIST = [
  'enum', 
  'string',
  'number',
  'object',
  'array',
  'bool'
];

const detect = (data) => {
  if(typeof data !== 'object'){
    return typeof data;
  }

  if(data instanceof Array){
    return 'array';
  }

}



module.exports = {
  TYPE_LIST,
  detect
}
