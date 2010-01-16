var StateMachine = function () {
  var that = {},
      states = {},
      currentState; 

  that.addState = function(name, transitions, action) {
    if (states[name] == undefined) {
      states[name] = new StateMachine.State(transitions, action);
    };
    if (currentState == undefined) {
      currentState = states[name];
    };
  };

  that.event = function(eventName) {
    var next = currentState.transitions[eventName];

    if (!next) {
      throw 'current state does not respond to event ' + eventName;
    };
    
    if (!states[next.name]) {
      throw 'no such next state ' + next.name + ' exists'
    };

    if (next.condition == undefined || next.condition(currentState)) {
      currentState = states[next.name];
    };
  };

  that.doAction = function () {
    var result;
    if (currentState.action) {
      currentState.action();
      result = true;
    };
    return result;
  };

  return that;
};

StateMachine.State = function (transitions, action) {
  return {
    transitions: transitions,
    action: action
  };
};

StateMachine.Transition = function (name, condition) {
  return {
    name: name,
    condition: condition
  };
};
