const { writeFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('./question')


describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo

  beforeEach(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterEach(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  test('should return a list of 0 questions', async () => {
    expect(await questionRepo.getQuestions()).toHaveLength(0)
  })

  test('should return a list of 2 questions', async () => {
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    expect(await questionRepo.getQuestions()).toHaveLength(2)
  })

  test('getQuestionById should return question with provided id ', async () => {
    const testQuestions = [
      {
        'id': '50f9e662-fa0e-4ec7-b53b-7845e8f821c3',
        'author': 'John Stockton',
        'summary': 'What is the shape of the Earth?',
        'answers': [
          {
            'id': 'ce7bddfb-0544-4b14-92d8-188b03c41ee4',
            'author': 'Brian McKenzie',
            'summary': 'The Earth is flat.'
          },
          {
            'id': 'd498c0a3-5be2-4354-a3bc-78673aca0f31',
            'author': 'Dr Strange',
            'summary': 'It is egg-shaped.'
          },
          {
            'id': 'd498c0a3-5be2-4354-a3bc-78673acadg45',
            'author': 'Janusz',
            'summary': 'It is flat as hell.'
          }
        ]
      },
      {
        'id': '00f3dd43-ae53-4430-8da1-b722e034c73d',
        'author': 'Sarah Nickle',
        'summary': 'Who let the dogs out?',
        'answers': []
      },
      {
        'id': '42342424v23v',
        'author': 'Spider-Man',
        'summary': 'Great power...? ',
        'answers': [
          {
            'id': '121234r42354f322',
            'author': 'Spider\'s uncle',
            'summary': 'With great power comes great responsibility!'
          },
          {
            'id': '121234r42354f322',
            'author': 'Spider\'s aunt',
            'summary': 'Feed the people with cary and hope!'
          }
        ]
      },
      {
        'id': '',
        'author': 'uuid',
        'summary': 'uuid test',
        'answers': []
      },
      {
        'id': '48ce9d71-904c-4932-94dd-2a49bf0ab5cf',
        'author': 'uuid',
        'summary': 'uuid test',
        'answers': []
      }
    ]
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    const testQuery = await questionRepo.getQuestionById('00f3dd43-ae53-4430-8da1-b722e034c73d')
    expect(await (testQuery)).toBeDefined()
    expect(await (testQuery)).toEqual({
      'id': '00f3dd43-ae53-4430-8da1-b722e034c73d',
      'author': 'Sarah Nickle',
      'summary': 'Who let the dogs out?',
      'answers': []
    })
    expect(await (testQuery.id)).toEqual('00f3dd43-ae53-4430-8da1-b722e034c73d')
  })

  test('getQuestionById should return message if UUID is not valid', async () => {
    expect(await questionRepo.getQuestionById('Dinozaur')).toEqual('Its not valid UUID')
  })

  test('addQuestion should add new question to the list', async () => {

    let newTestQuestion = {
      'id': faker.datatype.uuid(),
      'author': 'Test',
      'summary': 'Test Summary',
      'answers': []
    }
    expect(await questionRepo.addQuestion(newTestQuestion)).toHaveLength(1)
    expect(await questionRepo.addQuestion(newTestQuestion)).toBeDefined()
  })

  test('getAnswers should get answers by questionId', async () => {

    const testQuestions = [
      {
        'id': '50f9e662-fa0e-4ec7-b53b-7845e8f821c3',
        'author': 'John Stockton',
        'summary': 'What is the shape of the Earth?',
        'answers': [
          {
            'id': 'ce7bddfb-0544-4b14-92d8-188b03c41ee4',
            'author': 'Brian McKenzie',
            'summary': 'The Earth is flat.'
          },
          {
            'id': 'd498c0a3-5be2-4354-a3bc-78673aca0f31',
            'author': 'Dr Strange',
            'summary': 'It is egg-shaped.'
          },
          {
            'id': 'd498c0a3-5be2-4354-a3bc-78673acadg45',
            'author': 'Janusz',
            'summary': 'It is flat as hell.'
          }
        ]
      }
    ]
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    const expectation = await questionRepo.getAnswers('50f9e662-fa0e-4ec7-b53b-7845e8f821c3')
    const expectedAnswers = [{
      'id': 'ce7bddfb-0544-4b14-92d8-188b03c41ee4',
      'author': 'Brian McKenzie',
      'summary': 'The Earth is flat.'
    },
      {
        'id': 'd498c0a3-5be2-4354-a3bc-78673aca0f31',
        'author': 'Dr Strange',
        'summary': 'It is egg-shaped.'
      },
      {
        'id': 'd498c0a3-5be2-4354-a3bc-78673acadg45',
        'author': 'Janusz',
        'summary': 'It is flat as hell.'
      }]

    expect(expectation).toHaveLength(3)
    expect(expectation).toEqual(expectedAnswers)

  })

  test('getAnswers should return message if UUID is not valid', async () => {
    expect(await questionRepo.getAnswers('Tyranozaur')).toEqual('Its not valid UUID')
  })

  test('getAnswer should get specific answer by questionId and answerId', async () => {

    const testQuestions = [
      {
        'id': '50f9e662-fa0e-4ec7-b53b-7845e8f821c3',
        'author': 'John Stockton',
        'summary': 'What is the shape of the Earth?',
        'answers': [
          {
            'id': 'ce7bddfb-0544-4b14-92d8-188b03c41ee4',
            'author': 'Brian McKenzie',
            'summary': 'The Earth is flat.'
          },
          {
            'id': 'd498c0a3-5be2-4354-a3bc-78673aca0f31',
            'author': 'Dr Strange',
            'summary': 'It is egg-shaped.'
          },
          {
            'id': 'd498c0a3-5be2-4354-a3bc-78673acadg45',
            'author': 'Janusz',
            'summary': 'It is flat as hell.'
          }
        ]
      }
    ]
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    const expectation = await questionRepo.getAnswer('50f9e662-fa0e-4ec7-b53b-7845e8f821c3', 'd498c0a3-5be2-4354-a3bc-78673aca0f31')
    const expectedAnswers = {
      'id': 'd498c0a3-5be2-4354-a3bc-78673aca0f31',
      'author': 'Dr Strange',
      'summary': 'It is egg-shaped.'
    }
    expect(expectation).toHaveLength(1)
    expect(expectation[0]).toEqual(expectedAnswers)
  })

  test('getAnswer should return message if UUID is not valid', async () => {

    expect(await questionRepo.getAnswer('50f9e662-fa0e-4ec7-b53b-7845e8f821c3', 'Charmander')).toEqual('Its not valid UUID')
    expect(await questionRepo.getAnswer('Pikachu', 'd498c0a3')).toEqual('Its not valid UUID')
    expect(await questionRepo.getAnswer('Pikachu', 'Charmander')).toEqual('Its not valid UUID')
  })

  test('addAnswer should add one answer to specific questionId', async () => {

    const testQuestions = [
      {
        'id': '50f9e662-fa0e-4ec7-b53b-7845e8f821c3',
        'author': 'John Stockton',
        'summary': 'What is the shape of the Earth?',
        'answers': []
      }
    ]

    let newTestAnswer = {
      'id': faker.datatype.uuid(),
      'author': 'Test Answer',
      'summary': 'Test Summary Answer'
    }
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    const expectation = await questionRepo.addAnswer('50f9e662-fa0e-4ec7-b53b-7845e8f821c3', newTestAnswer)
    expect(expectation).toHaveLength(1)
  })

  test('addAnswer should return message if UUID is not valid', async () => {
    let newTestAnswer = {
      'id': faker.datatype.uuid(),
      'author': 'Test Answer',
      'summary': 'Test Summary Answer'
    }


    expect(await questionRepo.addAnswer('Tyranozaur',newTestAnswer)).toEqual('Its not valid UUID')
  })

})

