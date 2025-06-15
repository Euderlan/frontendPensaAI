// Detecta matéria baseada na mensagem
export const detectSubject = (message) => {
  const subjects = {
    'matemática': ['função', 'equação', 'derivada', 'integral', 'álgebra', 'geometria', 'trigonometria', 'cálculo'],
    'física': ['força', 'energia', 'movimento', 'velocidade', 'aceleração', 'gravidade', 'onda', 'luz'],
    'química': ['átomo', 'molécula', 'reação', 'ligação', 'elemento', 'tabela periódica', 'ph', 'ácido'],
    'biologia': ['célula', 'dna', 'evolução', 'fotossíntese', 'respiração', 'reprodução', 'genética'],
    'história': ['guerra', 'revolução', 'império', 'século', 'civilização', 'cultura', 'brasil'],
    'geografia': ['clima', 'relevo', 'população', 'país', 'continente', 'oceano', 'cidade'],
    'português': ['verbo', 'substantivo', 'sintaxe', 'literatura', 'texto', 'gramática', 'redação'],
    'inglês': ['verb', 'noun', 'grammar', 'vocabulary', 'pronunciation', 'english']
  };

  const messageLower = message.toLowerCase();
  for (const [subject, keywords] of Object.entries(subjects)) {
    if (keywords.some(keyword => messageLower.includes(keyword))) {
      return subject;
    }
  }
  return 'geral';
};

// Emoji para cada matéria
export const getSubjectEmoji = (subject) => {
  const emojis = {
    'matemática': '📊',
    'física': '⚡',
    'química': '🧪',
    'biologia': '🌱',
    'história': '📚',
    'geografia': '🌍',
    'português': '📝',
    'inglês': '🇺🇸',
    'geral': '🤖'
  };
  return emojis[subject] || '🤖';
};

// Gera resposta da IA
export const getAIResponse = async (message) => {
  const subject = detectSubject(message);
  const emoji = getSubjectEmoji(subject);

  const responses = [
    `${emoji} Interessante! Me conte: o que você já sabe sobre esse assunto?`,
    `${emoji} Ótima pergunta! Qual seria o primeiro passo para resolver isso?`,
    `${emoji} Vamos pensar juntos. Como você aplicaria isso na prática?`,
    `${emoji} Você está no caminho certo! Que tal conectar com algo que já conhece?`,
    `${emoji} Excelente! Qual seria o próximo passo lógico aqui?`,
    `${emoji} Muito bem! Vamos usar perguntas para te guiar. Que informações você tem?`,
    `${emoji} Ótima escolha de tema! Que tal começarmos pelos conceitos básicos?`
  ];

  // Simula delay da API
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

  let response = responses[Math.floor(Math.random() * responses.length)];

  // Adiciona dicas específicas ocasionalmente
  if (Math.random() < 0.4) {
    const tips = {
      'matemática': '\n\n💡 **Dica**: Tente visualizar o problema. Desenhos ajudam muito!',
      'física': '\n\n💡 **Dica**: Identifique as grandezas e suas unidades primeiro.',
      'química': '\n\n💡 **Dica**: Lembre-se da tabela periódica e das propriedades dos elementos.',
      'biologia': '\n\n💡 **Dica**: Estrutura e função sempre estão relacionadas.',
      'história': '\n\n💡 **Dica**: Contextualize no tempo e espaço da época.',
      'geografia': '\n\n💡 **Dica**: Pense nas relações entre espaço, sociedade e natureza.',
      'português': '\n\n💡 **Dica**: Analise o contexto e a estrutura do texto.',
      'inglês': '\n\n💡 **Dica**: Context is key! Think about when and how it\'s used.'
    };
    response += tips[subject] || '';
  }

  // Adiciona encorajamento ocasionalmente
  if (Math.random() < 0.3) {
    const encouragements = [
      '\n\n🌟 Você está no caminho certo! Continue explorando.',
      '\n\n💪 Ótima pergunta! Isso mostra pensamento crítico.',
      '\n\n🎯 Excelente! Vamos aprofundar esse raciocínio.',
      '\n\n🚀 Muito bem! Seu progresso é notável.',
      '\n\n🔥 Continue assim! A curiosidade é o combustível do aprendizado.'
    ];
    response += encouragements[Math.floor(Math.random() * encouragements.length)];
  }

  return response;
};