// Itens de dados X, Y e Z

// id="readLock(X)" Ler e bloquear de forma compartilhada o item de dado X - Nesse caso pode ler, mas não pode escrever, ou seja se outro tentar acessar, permite

// id="writeLock(X)" Ler/Escrever e bloquear de forma exclusiva o item de dado X - Nesse caso pode tanto ler como escrever

// Nesse caso de bloqueio exclusivo se outra transação tentar acessar, deve exibir modal "não foi possível, pois o item está bloqueado"

// id="readItem(X)" Ler o item de dado X, não realiza o bloqueio, somente leitura

// id="unlock(X)" Desbloquear o item de dado X

// Exibir as transações bloqueadas na tabela id="tableTransacoesBloqueadas"
// Exibir as transações ativas na tabela id="tableTransacoesAtivas"
// Exibir as transações em espera id="tableTransacoesEspera"

// Segunda etapa de implementação Controle de Impasse
// Wait-Die e Wound-awai

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

let waitDie = false;
let woundWait = false;


function addTransacaoAtiva(transacao) {
    switch (transacao) {
        case "1":
            document.getElementById('ativa1').style.color = "black";
            timestamps[0] = new Date().getTime();
            break;
        case "2":
            document.getElementById('ativa2').style.color = "black";
            timestamps[1] = new Date().getTime();
            break;
        case "3":
            document.getElementById('ativa3').style.color = "black";
            timestamps[2] = new Date().getTime();
        default:
            break;
    }

    console.log("Timestamps: " + timestamps[0] + ", " + timestamps[1] + ", " + timestamps[2]);
}

function addTransacaoEmEspera(transacao) {
    switch (transacao) {
        case "1":
            document.getElementById('espera1').style.color = "black";
            if (timestamps[0] == 0) timestamps[0] = new Date().getTime();
            break;
        case "2":
            document.getElementById('espera2').style.color = "black";
            if (timestamps[1] == 0) timestamps[1] = new Date().getTime();
            break;
        case "3":
            document.getElementById('espera3').style.color = "black";
            if (timestamps[2] == 0) timestamps[2] = new Date().getTime();
        default:
            break;
    }

    console.log("Timestamps: " + timestamps[0] + ", " + timestamps[1] + ", " + timestamps[2]);
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

function unlock(dado, transacao) {
    console.log("UNLOCK(" + dado.nome + ")");
    if (dado.bloqueio == "WriteLock" && dado.transBloqEscri == transacao) {
        dado.bloqueio = "Unlock";
        dado.transBloqEscri = null;

        updateCardTransBloq(dado);

        console.log(dado.nome + ": STATUS - " + dado.bloqueio);
        console.log("liberar transações em espera");

        //liberaTransacoes(dado);
        //checar se o array transacaoespera esta vazio, se n tiver:
            //exibe protocolo adotado
            //restarta transacao em questao
        //desperta quem ta esperando
    } else if (dado.bloqueio == "ReadLock" && (dado.transBloqLeit.indexOf(transacao) > -1)) {
        dado.contador = dado.contador - 1;
        var pos = dado.transBloqLeit.indexOf(transacao);
        dado.transBloqLeit.splice(pos, 1);

        console.log(dado.nome + ": STATUS - " + dado.bloqueio + " / N. TRANS. LENDO: " + dado.contador);

        if (dado.contador == 0) {
            dado.bloqueio = "Unlock";

            console.log(dado.nome + ": STATUS - " + dado.bloqueio + " / N. TRANS. LENDO: " + dado.contador);
            console.log("liberar transações em espera");
            //liberaTransacoes(dado);
            //checar se o array transacaoespera esta vazio, se n tiver:
                //exibe protocolo adotado
                //restarta transacao em questao
            //desperta quem ta esperando
        }
    } else {
        console.log("Op não realizada, pois transação " + transacao + " não possui nenhum bloqueio sobre o dado " + dado.nome);
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

        console.log(dado.nome + ": STATUS - " + dado.bloqueio + " / N. TRANS. LENDO: " + dado.contador + " / LISTA TRANS LENDO: " + dado.transBloqLeit.toString()
                                                                                                       + " / LISTA TRANS ESCREVENDO: " + dado.transBloqEscri);

    } else if (dado.bloqueio == "ReadLock" && (dado.transBloqLeit.indexOf(transacao) == -1)) {
        dado.contador = dado.contador + 1;
        dado.transBloqLeit.push(transacao);
        addTransacaoAtiva(transacao);

        console.log(dado.nome + ": STATUS - " + dado.bloqueio + " / N. TRANS. LENDO: " + dado.contador + " / LISTA TRANS LENDO: " + dado.transBloqLeit.toString()
                                                                                                       + " / LISTA TRANS ESCREVENDO: " + dado.transBloqEscri);

    } else if (dado.bloqueio == "WriteLock" && dado.transBloqEscri == transacao){

        console.log(dado.nome + ": STATUS ANTERIOR - " + dado.bloqueio + " / N. TRANS. LENDO: " + dado.contador + " / LISTA TRANS LENDO: " + dado.transBloqLeit.toString()
                                                                                                       + " / LISTA TRANS ESCREVENDO: " + dado.transBloqEscri);
        dado.bloqueio = "ReadLock"
        dado.transBloqLeit == null;
        dado.transBloqLeit.ṕush(transacao);
    
        console.log(dado.nome + ": STATUS POSTERIOR - " + dado.bloqueio + " / N. TRANS. LENDO: " + dado.contador + " / LISTA TRANS LENDO: " + dado.transBloqLeit.toString()
                                                                                                       + " / LISTA TRANS ESCREVENDO: " + dado.transBloqEscri);
    } else if (dado.bloqueio == "WriteLock" && dado.transBloqEscri != transacao && (dado.transBloqLeit.indexOf(transacao) == -1)) { 
        if (waitDie) {
            console.log("Protocolo Wait-Die")
            if (timestamps[transacao - 1] < timestamps[dado.transBloqEscri - 1]) {
                console.log("Transação " + transacao + " em espera");
                addTransacaoEmEspera(transacao);
            } else {
                console.log("Transação " + transacao + " restartada");
                //libera o que ela ta bloqueando e encerra
            }
        } else if (woundWait) {
            console.log("Protocolo Wound-Wait")
            if (timestamps[transacao - 1] < timestamps[dado.transBloqLeit]) {
                console.log("Transação " + dado.transBloqEscri + " restartada");
            } else {
                console.log("Transação " + transacao + " em espera");
                addTransacaoEmEspera(transacao);
            }
        } else {
            //add alerta de deadlock
            console.log('NOVA TRANSACAO EM ESPERA');
            addTransacaoEmEspera(transacao);
        }
        //criar array salvando um novo objeto transacaoespera, q tem: dado, transacao, timestamp e operacao
    }

    updateCardTransBloq(dado);
}

function writeLock(dado, transacao) {
    console.log("WRITE-LOCK(" + dado.nome + ")");
    if (dado.bloqueio == "Unlock") {
        dado.bloqueio = "WriteLock";
        dado.transBloqEscri = transacao;
        addTransacaoAtiva(transacao);

        console.log(dado.nome + ": STATUS - " + dado.bloqueio + " / N. TRANS. LENDO: " + dado.contador + " / LISTA TRANS LENDO: " + dado.transBloqLeit.toString()
                                                                                                       + " / LISTA TRANS ESCREVENDO: " + dado.transBloqEscri);
    } else if (dado.bloqueio == "ReadLock"){

        console.log(dado.nome + ": STATUS ANTERIOR - " + dado.bloqueio + " / N. TRANS. LENDO: " + dado.contador + " / LISTA TRANS LENDO: " + dado.transBloqLeit.toString()
                                                                                                                + " / LISTA TRANS ESCREVENDO: " + dado.transBloqEscri);

        if((dado.contador == 1) && (dado.transBloqLeit.indexOf(transacao) > -1)){
            dado.bloqueio = "WriteLock";
            dado.transBloqEscri = transacao;
            var pos = dado.transBloqLeit.indexOf(transacao);
            dado.transBloqLeit.splice(pos, 1);
            dado.contador = 0;
        
            console.log(dado.nome + ": STATUS POSTERIOR - " + dado.bloqueio + " / N. TRANS. LENDO: " + dado.contador + " / LISTA TRANS LENDO: " + dado.transBloqLeit.toString()
                                                                                                                     + " / LISTA TRANS ESCREVENDO: " + dado.transBloqEscri);
        } else {
            //add alerta de deadlock
            //no caso de ter mais de uma com o readlock, o q q faz??
            console.log(dado.nome + " - NAO MODIFICADO, NOVA TRANSAÇÃO EM ESPERA");
            addTransacaoEmEspera(transacao);
        }
    } else {
        if (waitDie) {
            console.log("Protocolo Wait-Die")
            if (timestamps[transacao - 1] < timestamps[dado.transBloqEscri - 1]) {
                console.log("Transação " + transacao + " em espera");
                addTransacaoEmEspera(transacao);
            } else {
                console.log("Transação " + transacao + " restartada");
                //libera o que ela ta bloqueando e encerra
            }
        } else if (woundWait) {
            console.log("Protocolo Wound-Wait")
            if (timestamps[transacao - 1] < timestamps[dado.transBloqEscri -1]) {
                console.log("Transação " + dado.transBloqEscri + " restartada");
            } else {
                console.log("Transação " + transacao + " em espera");
                addTransacaoEmEspera(transacao);
            }
        } else {
            //add alerta de deadlock
            console.log('NOVA TRANSACAO EM ESPERA');
            addTransacaoEmEspera(transacao);
        }
        //criar array salvando um novo objeto transacaoespera, q tem: dado, transacao, timestamp e operacao
    } 

    updateCardTransBloq(dado);
}

function readItem(dado, transacao) {
    console.log("READ-ITEM(" + dado.nome + ")");
    if (dado.transBloqLeit.indexOf(transacao) > -1) {
        console.log(transacao + " pode ler " + dado);
    } else if (dado.transBloqEscri == transacao) {
        console.log(transacao + " pode ler " + dado);
    } else {
        console.log("Op não permitida");
    }
}

function writeItem(dado, transacao) {
    console.log("WRITE-ITEM(" + dado.nome + ")");
    if (dado.transBloqEscri == transacao) {
        console.log(transacao + " pode escrever em " + dado);
    } else {
        console.log("Op não permitida");
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
            //se a transação tiver free
            removeTransacao(transacao);
        default:
            break;
    }
}

function Enviar() {
    var transacoes = document.getElementById('transacoes').value;
    var transacaoSelecionada = $("input[type='radio'][name='transacao']:checked").val();

    var acao = document.getElementById('acoes');
    var acaoSelecionada = acao.value;

    checkAcaoSelecionada(acaoSelecionada.toString(), transacaoSelecionada.toString());
}

function ativarWaitDie() {
    waitDie = true;
    alert("Wait Die ativado! valor = " + waitDie);
}

function ativarWoundWait() {
    woundWait = true;
    alert("Wound Wait ativado! valor = " + woundWait);
}