module.exports = toolbox => {
  function fillPrompt(prompt, modelInstance) {
    return prompt.map(q => {
      if (modelInstance[q.name]) return { ...q, initial: modelInstance[q.name] }
      return q
    })
  }

  toolbox.fillPrompt = fillPrompt
}
