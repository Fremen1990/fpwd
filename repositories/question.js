const { readFile, writeFile } = require('fs/promises')
const { v4 } = require('uuid')

const makeQuestionRepository = fileName => {


  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    return JSON.parse(fileContent)
  }

  const getQuestionById = async questionId => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)
    return questions.find(question => question.id === questionId)
  }

  const addQuestion = async question => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = await JSON.parse(fileContent)
    await questions.push(question)
    await writeFile(fileName, JSON.stringify(questions), err => {
      if (err) throw err
    })
    console.log(`Done writing, the question below has been added to the repository: \n ${question}`)
  }
  const getAnswers = async questionId => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = await JSON.parse(fileContent)

    const questionById = await questions.find(question => question.id === questionId)

    const answersByQuestionId = await questionById.answers
    return answersByQuestionId
  }
  const getAnswer = async (questionId, answerId) => {
  }
  const addAnswer = async (questionId, answer) => {
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
