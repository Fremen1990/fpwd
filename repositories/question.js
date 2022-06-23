const { readFile, writeFile, appendFile } = require('fs/promises')
const { v4: uuidv4 } = require('uuid')

const uuidCreator = (newRecord) => {
  if (newRecord.id === undefined || newRecord.id === null || newRecord.id === '') {
    return { ...newRecord, id: uuidv4() }
  } else return newRecord
}

const uuidValidator = (isUUID) => {
// Regular expression to check if string is a valid UUID
  const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
  return regexExp.test(isUUID)
}

const makeQuestionRepository = fileName => {

  const loadQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    return await JSON.parse(fileContent)
  }

  const getQuestions = async () => {
    return loadQuestions()
  }

  const getQuestionById = async questionId => {
    if (uuidValidator(questionId)) {
      const questions = await loadQuestions()
      return questions.find(question => question.id === questionId)
    } else {
      throw new Error('Its not valid UUID')
    }
  }

  const addQuestion = async question => {
    const questionWithUUID = uuidCreator(question)
    const questions = await loadQuestions()
    await questions.push(questionWithUUID)
    await writeFile(fileName, JSON.stringify(questions), err => {
      if (err) throw err
    })
    console.log(`Done writing, the question below has been added to the repository: \n ${question}`)
  }
  const getAnswers = async questionId => {
    if (uuidValidator(questionId)) {
      const questions = await loadQuestions()
      const questionById = await questions.find(question => question.id === questionId)
      return await questionById.answers
    } else {
      return new Error('Its not valid UUID')
    }
  }
  const getAnswer = async (questionId, answerId) => {
    if (uuidValidator(questionId) || uuidValidator(answerId)) {
      const questions = await loadQuestions()
      const questionById = await questions.find(question => question.id === questionId)
      return questionById.answers.filter(answer => answer.id === answerId)
    } else {
      return new Error('Its not valid UUID')
    }
  }

  const addAnswer = async (questionId, answer) => {
    if (uuidValidator(questionId) ) {
      const answerWithUUID = uuidCreator(answer)
      const questions = await loadQuestions()
      const questionById = await questions.filter(question => question.id === questionId)
      const answersByIdsQuestions = await questionById[0].answers
      await answersByIdsQuestions.push(answerWithUUID)
      await writeFile(fileName, JSON.stringify(questions), err => {
        if (err) throw err
      })
    } else {
      return new Error('Its not valid UUID')
    }
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
