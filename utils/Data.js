class Data{
  dataAtual(){
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return new Date(`${ano}-${mes}-${dia} 00:00`);
  }
}

module.exports = new Data();