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
// Wait-Die e Wound-await