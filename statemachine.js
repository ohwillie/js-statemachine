var StateMachine = function () {
  var that = {},
      states = {},
      currentState; 

  that.addState = function (name, transitions, action) {
    if (!states[name]) {
      states[name] = new StateMachine.State(transitions, action);
    };
    if (!currentState) {
      currentState = states[name];
    };
  };

  that.event = function (eventName) {
    var next = currentState.transitions[eventName];

    if (!next) {
      throw 'current state does not respond to event ' + eventName;
    };
    
    if (!states[next.name]) {
      throw 'no such next state ' + next.name + ' exists'
    };

    if (!next.condition || next.condition(currentState)) {
      currentState = states[next.name];
    };
  };

  that.doAction = function () {
    if (currentState.action) {
      return currentState.action();
    };
  };

  return that;
};

// Expected arguments:
//   transitions: {
//     <transitionName>: <transitionObject>
//   }
//   action: <aFunction>
//
// action is a callback function that may be called via the
// StateMachine using doAction.
StateMachine.State = function (transitions, action) {
  return {
    transitions: transitions,
    action: action
  };
};

// Expected arguments:
//   name: <aString>
//   condition: <aFunction>
//
// condition is passed the current state object from the
// StateMachine, so attaching extra information to a state
// can allow for richer conditional transitions.
StateMachine.Transition = function (name, condition) {
  return {
    name: name,
    condition: condition
  };
};
