function TransacaoEspera(transacao, dado, acao) {
    this.transacao = transacao;
    this.dado = dado;
    this.acao = acao;
    this.timestamp = timestamps[transacao - 1];
}

let X = {
    nome: "X",
    bloqueio: "Unlock",
    transBloqLeit: [],
    transBloqEscri: null,
    contador: 0
}

let Y = {
    nome: "Y",
    bloqueio: "Unlock",
    transBloqLeit: [],
    transBloqEscri: null,
    contador: 0
}

let Z = {
    nome: "Z",
    bloqueio: "Unlock",
    transBloqLeit: [],
    transBloqEscri: null,
    contador: 0
}

let timestamps = [0, 0, 0];

let transacoesEmEspera = [];

let waitDie = false;
let woundWait = false;

let dados = [X, Y, Z];

function restartarTransacao(transacao) {
    dados.forEach(element => {
        if(element.transBloqEscri == transacao) {
            element.bloqueio = "Unlock";
            element.transBloqEscri = null;
        } else if (element.transBloqLeit.includes(transacao)) {
            if (element.contador == 1) {
                element.bloqueio = "Unlock";
            } 
            var pos = element.transBloqLeit.indexOf(transacao);
            element.transBloqLeit.splice(pos, 1);
            element.contador = element.contador - 1;
        }

        console.log(element.nome + ": " + element.bloqueio + ", bloqueando escrita: " + element.transBloqEscri + ", bloqueando leitura: " + element.transBloqLeit.toString() + ", numero trans: " + element.contador);
        updateCardTransBloq(element);
    });
}

function addTransacaoAtiva(transacao) {
    switch (transacao) {
        case "1":
            document.getElementById('ativa1').style.color = "black";
            if (timestamps[0] == 0) {
                timestamps[0] = new Date().getTime();
            }
            document.getElementById('ativa1').textContent = "Transação 1 - TS: " + timestamps[0];
            break;
        case "2":
            document.getElementById('ativa2').style.color = "black";
            if (timestamps[1] == 0) {
                timestamps[1] = new Date().getTime();
            }
            document.getElementById('ativa2').textContent = "Transação 2 - TS: " + timestamps[1];
            break;
        case "3":
            document.getElementById('ativa3').style.color = "black";
            if (timestamps[2] == 0) {
                timestamps[2] = new Date().getTime();
            }
            document.getElementById('ativa3').textContent = "Transação 3 - TS: " + timestamps[2];
            break;
        default:
            break;
    }

}

function addTransacaoEmEspera(transacaoEspera) {
    switch (transacaoEspera.transacao) {
        case "1":
            if (waitDie || woundWait) {
                document.getElementById('espera1').style.color = "black";
            }
            if (timestamps[0] == 0) timestamps[0] = new Date().getTime();
            document.getElementById('espera1').textContent = "Transação 1 - TS: " + timestamps[0];
            break;
        case "2":
            if (waitDie || woundWait) {
                document.getElementById('espera2').style.color = "black";
            }
            if (timestamps[1] == 0) timestamps[1] = new Date().getTime();
            document.getElementById('espera2').textContent = "Transação 2 - TS: " + timestamps[1];
            break;
        case "3":
            if (waitDie || woundWait) {
                document.getElementById('espera3').style.color = "black";
            }
            if (timestamps[2] == 0) timestamps[2] = new Date().getTime();
            document.getElementById('espera3').textContent = "Transação 3 - TS: " + timestamps[2];
        default:
            break;
    }
    
    transacoesEmEspera.push(transacaoEspera);
}

function removeTransacao(transacao) {
    switch (transacao) {
        case "1":
            document.getElementById('ativa1').style.color = "white";
            document.getElementById('espera1').style.color = "white";
            break;
        case "2":
            document.getElementById('ativa2').style.color = "white";
            document.getElementById('espera2').style.color = "white";
            break;
        case "3":
            document.getElementById('ativa3').style.color = "white";
            document.getElementById('espera3').style.color = "white";
        default:
            break;
    }
}

function updateCardTransBloq (dado) {
    switch (dado.nome) {
        case "X":
            document.getElementById('bloqueioX').textContent = dado.bloqueio;
            document.getElementById('transBloqX').textContent = (dado.transBloqEscri || dado.transBloqLeit.length == 0) ? dado.transBloqEscri : dado.transBloqLeit.toString();
            break;
        case "Y":
            document.getElementById('bloqueioY').textContent = dado.bloqueio;
            document.getElementById('transBloqY').textContent = (dado.transBloqEscri || dado.transBloqLeit.length == 0) ? dado.transBloqEscri : dado.transBloqLeit.toString();
            break;
        case "Z":
            document.getElementById('bloqueioZ').textContent = dado.bloqueio;
            document.getElementById('transBloqZ').textContent = (dado.transBloqEscri || dado.transBloqLeit.length == 0) ? dado.transBloqEscri : dado.transBloqLeit.toString();
            break;
        default:
            break;
    }
}

function compararTS (ts1, ts2) {
    return ts1-ts2;
}

function unlock(dado, transacao) {
    console.log("UNLOCK(" + dado.nome + ")");
    if (dado.bloqueio == "WriteLock" && dado.transBloqEscri == transacao) {
        dado.bloqueio = "Unlock";
        dado.transBloqEscri = null;

        document.getElementById('resultado').textContent = "Transação " + transacao + ": OP UNLOCK(" + dado.nome + ") - SUCESSO";
        setTimeout(() => {
            document.getElementById('resultado').textContent = "Checando transações pausadas...";
        }, 2000);
        var find = false;
        var transacaoesp;
        if (transacoesEmEspera.length > 0) {
            var i = 0;
            while (i < transacoesEmEspera.length) {
                if(transacoesEmEspera[i].dado == dado) { 
                    transacaoesp = transacoesEmEspera[i];
                    find = true;
                    break;
                }
                i = i + 1;
            }

            setTimeout(() => {
                if(find) {
                    var pos = transacoesEmEspera.indexOf(transacaoesp);
                    transacoesEmEspera.splice(pos, 1);
                    setTimeout(() => {
                        checkAcaoSelecionada(transacaoesp.acao.toString(), transacaoesp.transacao.toString());
                    }, 1000);
                }
            }, 2000);
        } else {
            setInterval(() => {
                document.getElementById('resultado').textContent = "Nenhuma transação encontrada";
            }, 4000);
        }

    } else if (dado.bloqueio == "ReadLock" && (dado.transBloqLeit.indexOf(transacao) > -1)) {
        dado.contador = dado.contador - 1;
        var pos = dado.transBloqLeit.indexOf(transacao);
        dado.transBloqLeit.splice(pos, 1);

        if (dado.contador == 0) {
            dado.bloqueio = "Unlock";

            document.getElementById('resultado').textContent = "Transação " + transacao + ": OP UNLOCK(" + dado.nome + ") - SUCESSO";
            setTimeout(() => {
                document.getElementById('resultado').textContent = "Checando transações pausadas...";
            }, 2000);
            var find = false;
            var transacaoesp;
            if (transacoesEmEspera.length > 0) {
                var i = 0;
                while (i < transacoesEmEspera.length) {
                    if(transacoesEmEspera[i].dado == dado) { 
                        transacaoesp = transacoesEmEspera[i];
                        find = true;
                        break;
                    }
                    i = i + 1;
                }

                setTimeout(() => {
                    if(find) {
                        var pos = transacoesEmEspera.indexOf(transacaoesp);
                        transacoesEmEspera.splice(pos, 1);
                        setTimeout(() => {
                            checkAcaoSelecionada(transacaoesp.acao.toString(), transacaoesp.transacao.toString());
                        }, 1000);
                    } 
                }, 2000);
            }  else {
                setInterval(() => {
                    document.getElementById('resultado').textContent = "Nenhuma transação encontrada";
                }, 4000);
            }  
        }
    } else {
        document.getElementById('resultado').textContent = "Operação não realizada: transação " + transacao + " não possui bloqueio sobre o dado " + dado.nome;
    }   

    updateCardTransBloq(dado);
}

function readLock(dado, transacao) {
    console.log("READ-LOCK(" + dado.nome + ")");
    if (dado.bloqueio == "Unlock") {
        dado.bloqueio = "ReadLock";
        dado.contador = 1;
        dado.transBloqLeit.push(transacao);

        addTransacaoAtiva(transacao);

        document.getElementById('resultado').textContent = "Transação " + transacao + ": OP READ-LOCK(" + dado.nome + ") - SUCESSO";
    } else if (dado.bloqueio == "ReadLock" && (dado.transBloqLeit.indexOf(transacao) == -1)) {
        dado.contador = dado.contador + 1;
        dado.transBloqLeit.push(transacao);
        addTransacaoAtiva(transacao);

        document.getElementById('resultado').textContent = "Transação " + transacao + ": OP READ-LOCK(" + dado.nome + ") - SUCESSO";
    } else if (dado.bloqueio == "WriteLock"){
        if (dado.transBloqEscri == transacao) {

            dado.transBloqEscri == null;

            dado.bloqueio = "ReadLock"
            dado.transBloqLeit.push(transacao);
            dado.contador = dado.contador + 1;
        
            document.getElementById('resultado').textContent = "Transação " + transacao + ": OP READ-LOCK(" + dado.nome + ") DOWNGRADE - SUCESSO";
        } else { 
            if (waitDie) {
                if (timestamps[transacao - 1] < timestamps[dado.transBloqEscri - 1]) {
                    addTransacaoEmEspera(new TransacaoEspera(transacao, dado, "ReadLock(" + dado.nome + ")"));
                    document.getElementById('resultado').textContent = "WAIT-DIE: Transação " + transacao + " com TS = " + timestamps[transacao-1] + " em espera";
                } else {
                    restartarTransacao(transacao);
                    removeTransacao(transacao);
                    document.getElementById('resultado').textContent = "WAIT-DIE: Transação " + transacao + " com TS = " + timestamps[transacao-1] + " restartada";
                }
            } else if (woundWait) {
                if (timestamps[transacao - 1] < timestamps[dado.transBloqLeit]) {
                    restartarTransacao(transacao);
                    removeTransacao(transacao);
                    document.getElementById('resultado').textContent = "WOUND-WAIT: Transação " + transacao + " com TS = " + timestamps[transacao-1] + " restartada";
                } else {
                    addTransacaoEmEspera(new TransacaoEspera(transacao, dado, "ReadLock(" + dado.nome + ")"));
                    document.getElementById('resultado').textContent = "WOUND-WAIT: Transação " + transacao + " com TS = " + timestamps[transacao-1] + " em espera";
                }
            } else {
                if ( checarDeadlock(dado)) {
                    document.getElementById('resultado').textContent = "NO-PROTOCOL: DEADLOCK";
                    addTransacaoEmEspera(new TransacaoEspera(transacao, dado, "ReadLock(" + dado.nome + ")"));
                } else {
                    document.getElementById('resultado').textContent = "Operação não realizada";
                    addTransacaoEmEspera(new TransacaoEspera(transacao, dado, "ReadLock(" + dado.nome + ")"));
                }  
            }
        }
    } 

    updateCardTransBloq(dado);
}

function checarDeadlock(dado) {
    console.log('checar deadlock');
    var res = false;
    transacoesEmEspera.forEach(element => {
        if (element.transacao == dado.transBloqEscri || dado.transBloqLeit.indexOf(element.transacao) > -1) {
            res = true;
        }
    });
    return res;
}

function writeLock(dado, transacao) {
    console.log("WRITE-LOCK(" + dado.nome + ")");
    if (dado.bloqueio == "Unlock") {
        dado.bloqueio = "WriteLock";
        dado.transBloqEscri = transacao;

        addTransacaoAtiva(transacao);

        document.getElementById('resultado').textContent = "Transação " + transacao + ": OP WRITE-LOCK(" + dado.nome + ") - SUCESSO";

    } else if (dado.bloqueio == "ReadLock" && (dado.contador == 1) && (dado.transBloqLeit.indexOf(transacao) > -1)){
            
            var pos = dado.transBloqLeit.indexOf(transacao);
            dado.transBloqLeit.splice(pos, 1);
            dado.contador = 0;

            dado.bloqueio = "WriteLock";
            dado.transBloqEscri = transacao;
        
            document.getElementById('resultado').textContent = "Transação " + transacao + ": OP WRITE-LOCK(" + dado.nome + ") UPGRADE - SUCESSO";
        
    } else {
        if (waitDie) {
            if (timestamps[transacao - 1] < timestamps[dado.transBloqEscri - 1]) {

                document.getElementById('resultado').textContent = "WAIT-DIE: Transação " + transacao + " com TS = " + timestamps[transacao-1] + " em espera";

                addTransacaoEmEspera(new TransacaoEspera(transacao, dado, "WriteLock(" + dado.nome +")"));
            } else {
                
                document.getElementById('resultado').textContent = "WAIT-DIE: Transação " + transacao + " com TS = " + timestamps[transacao-1] + " restartada";
                restartarTransacao(transacao);
                removeTransacao(transacao);
            }
        } else if (woundWait) {
            if (timestamps[transacao - 1] < timestamps[dado.transBloqEscri -1]) {
                document.getElementById('resultado').textContent = "WOUND-WAIT: Transação " + transacao + " com TS = " + timestamps[transacao-1] + " restartada";

                restartarTransacao(transacao);
                removeTransacao(transacao);
            } else {
                document.getElementById('resultado').textContent = "WOUND-WAIT: Transação " + transacao + " com TS = " + timestamps[transacao-1] + " em espera";
                addTransacaoEmEspera(new TransacaoEspera(transacao, dado, "WriteLock(" + dado.nome +")"));
            }
        } else {
            if (checarDeadlock(dado)) {
                document.getElementById('resultado').textContent = "NO-PROTOCOL: DEADLOCK";
                addTransacaoEmEspera(new TransacaoEspera(transacao, dado, "WriteLock(" + dado.nome + ")"));
            } else {
                document.getElementById('resultado').textContent = "Operação não realizada";
                addTransacaoEmEspera(new TransacaoEspera(transacao, dado, "WriteLock(" + dado.nome +")"));
            }
            
        }

    } 

    updateCardTransBloq(dado);
}

function readItem(dado, transacao) {
    if (dado.transBloqLeit.indexOf(transacao) > -1) {
        document.getElementById('resultado').textContent = "Transação " + transacao + ": OP READ-ITEM(" + dado.nome + ") permitida";
        console.log(transacao + " pode ler " + dado.nome);
    } else if (dado.transBloqEscri == transacao) {
        document.getElementById('resultado').textContent = "Transação " + transacao + ": OP READ-ITEM(" + dado.nome + ") permitida";
        console.log(transacao + " pode ler " + dado.nome);
    } else {
        document.getElementById('resultado').textContent = "OP NÃO PERMITIDA: Transação " + transacao + " não possui WRITELOCK ou READLOCK sobre o item " + dado.nome;
    }
}

function writeItem(dado, transacao) {
    if (dado.transBloqEscri == transacao) {
        document.getElementById('resultado').textContent = "Transação " + transacao + ": OP WRITE-ITEM(" + dado.nome + ") permitida";
        console.log(transacao + " pode escrever em " + dado);
    } else {
        document.getElementById('resultado').textContent = "OP NÃO PERMITIDA: Transação " + transacao + " não possui WRITELOCK sobre o item " + dado.nome;
    }
}

function checkAcaoSelecionada(acao, transacao) {
    switch (acao) {
        //readlock
        case "ReadLock(X)":
            readLock(X, transacao);
            break;
        case "ReadLock(Y)":
            readLock(Y, transacao);
            break;
        case "ReadLock(Z)":
            readLock(Z, transacao);    
            break;

        //writelock
        case "WriteLock(X)":
            writeLock(X, transacao); 
            break;
        case "WriteLock(Y)":
            writeLock(Y, transacao);      
            break;
        case "WriteLock(Z)":
            writeLock(Z, transacao);    
            break;

        //unlockitem
        case "Unlock(X)":
            unlock(X, transacao);
            break;
        case "Unlock(Y)":
            unlock(Y, transacao);
            break;
        case "Unlock(Z)":
            unlock(Z, transacao);
            break;

        //readitem
        case "ReadItem(X)":
            readItem(X, transacao);
            break;
        case "ReadItem(Y)":
            readItem(Y, transacao);        
            break;
        case "ReadItem(Z)":
            readItem(Z, transacao);    
            break;

        //writeitem
        case "WriteItem(X)":
            writeItem(X, transacao);
            break;            
        case "WriteItem(Y)":
            writeItem(Y, transacao);
            break;
        case "WriteItem(Z)":
            writeItem(Z, transacao);
            break;

        case "End":
            if (transacaoLivre(transacao)) { 
                removeTransacao(transacao);
            } else {
                document.getElementById('resultado').textContent = "OP NÃO PERMITIDA: Transação " + transacao + " possui bloqueio sobre itens de dados";
            }
        default:
            break;
    }
}

function transacaoLivre(transacao) {
    var livre = true;
    dados.forEach(element => {
        if(element.transBloqEscri == transacao || element.transBloqLeit.includes(transacao) || checarEspera(transacao)) {
            livre = false;
        }
    });
    return livre;
}

function checarEspera(transacaoSelecionada) {
    var espera = false;
    transacoesEmEspera.forEach(element => {
        if (element.transacao == transacaoSelecionada) {
            espera = true;
        }
    });
    return espera;
}

function Enviar() {
    var transacoes = document.getElementById('transacoes').value;
    var transacaoSelecionada = $("input[type='radio'][name='transacao']:checked").val();

    var acao = document.getElementById('acoes');
    var acaoSelecionada = acao.value;

    if(!checarEspera(transacaoSelecionada)){
        checkAcaoSelecionada(acaoSelecionada.toString(), transacaoSelecionada.toString());
    } else { 
        document.getElementById('resultado').textContent = "OP NÃO PERMITIDA: Transação " + transacaoSelecionada + " em espera";
    }
}

function desabilitar() {
    waitDie = false;
    woundWait = false;
    document.getElementById('resultado').textContent =  "Protocolos desabilitados";
    document.getElementById('desabilitado').style.background = "green"; 
    document.getElementById('waitDie').style.background = "gray";
    document.getElementById('woundWait').style.background = "gray";
}


function ativarWaitDie() {
    waitDie = true;
    woundWait = false;
    document.getElementById('resultado').textContent =  "Protocolo Wait-Die ativado";
    document.getElementById('desabilitado').style.background = "gray"; 
    document.getElementById('waitDie').style.background = "green";
    document.getElementById('woundWait').style.background = "gray";
}

function ativarWoundWait() {
    woundWait = true;
    waitDie = false;
    document.getElementById('resultado').textContent = "Protocolo Wound-Wait ativado";
    document.getElementById('desabilitado').style.background = "gray"; 
    document.getElementById('waitDie').style.background = "gray";
    document.getElementById('woundWait').style.background = "green";
}