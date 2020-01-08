class ActivationFunction {
  constructor(func, dfunc) {
    this.function = func;
    this.function_derivative = dfunc;
  }
}

let sigmoid = new ActivationFunction(
  x => 1 / (1 + Math.exp(-x)),
  y => y * (1 - y)
);

let tanh = new ActivationFunction(
  x => Math.tanh(x),
  y => 1 - (y * y)
);


class NeuralNetwork {
  /*
  * if first argument is a NeuralNetwork the constructor clones it
  * USAGE: cloned_nn = new NeuralNetwork(to_clone_nn);
  */
  constructor(in_nodes, hid_nodes, out_nodes) {
    if (in_nodes instanceof NeuralNetwork) {
      let a = in_nodes;
      this.input_nodes = a.input_nodes;
      this.hidden_nodes = a.hidden_nodes;
      this.output_nodes = a.output_nodes;

      this.weights_hidden_input = a.weights_hidden_input.copy();
      this.weights_hidden_output = a.weights_hidden_output.copy();

      this.bias_h = a.bias_h.copy();
      this.bias_o = a.bias_o.copy();
    } else {
      this.input_nodes = in_nodes;
      this.hidden_nodes = hid_nodes;
      this.output_nodes = out_nodes;

      this.weights_hidden_input = new Algebra(this.hidden_nodes, this.input_nodes);
      this.weights_hidden_output = new Algebra(this.output_nodes, this.hidden_nodes);
      this.weights_hidden_input.randomize();
      this.weights_hidden_output.randomize();

      this.bias_h = new Algebra(this.hidden_nodes, 1);
      this.bias_o = new Algebra(this.output_nodes, 1);
      this.bias_h.randomize();
      this.bias_o.randomize();
    }

    // TODO: copy these as well
    this.setLearningRate();
    this.setActivationFunction();


  }

  predict(input_array) {

    // Generating the Hidden Outputs
    let inputs = Algebra.fromArray(input_array);
    let hidden = Algebra.multiply(this.weights_hidden_input, inputs);
    hidden.add(this.bias_h);
    // activation function!
    hidden.map(this.activation_function.function);

    // Generating the output's output!
    let output = Algebra.multiply(this.weights_hidden_output, hidden);
    output.add(this.bias_o);
    output.map(this.activation_function.function);

    // Sending back to the caller!
    return output.toArray();
  }

  setLearningRate(learning_rate = 0.3) {
    this.learning_rate = learning_rate;
  }

  setActivationFunction(func = sigmoid) {
    this.activation_function = func;
  }

  back_propogation(input_array, target_array) {
    // Generating the Hidden Outputs
    let inputs = Algebra.fromArray(input_array);
    let hidden = Algebra.multiply(this.weights_hidden_input, inputs);
    hidden.add(this.bias_h);
    // activation function!
    hidden.map(this.activation_function.function);

    // Generating the output's output!
    let outputs = Algebra.multiply(this.weights_hidden_output, hidden);
    outputs.add(this.bias_o);
    outputs.map(this.activation_function.function);

    // Convert array to Algebra object
    let targets = Algebra.fromArray(target_array);

    // Calculate the error
    // ERROR = TARGETS - OUTPUTS
    let output_errors = Algebra.subtract(targets, outputs);

    // let gradient = outputs * (1 - outputs);
    // Calculate gradient
    let gradients = Algebra.map(outputs, this.activation_function.function_derivative);
    gradients.multiply(output_errors);
    gradients.multiply(this.learning_rate);


    // Calculate deltas
    let hidden_T = Algebra.transpose(hidden);
    let weight_hidden_output_deltas = Algebra.multiply(gradients, hidden_T);

    // Adjust the weights by deltas
    this.weights_hidden_output.add(weight_hidden_output_deltas);
    // Adjust the bias by its deltas (which is just the gradients)
    this.bias_o.add(gradients);

    // Calculate the hidden layer errors
    let whidden_output_t = Algebra.transpose(this.weights_hidden_output);
    let hidden_errors = Algebra.multiply(whidden_output_t, output_errors);

    // Calculate hidden gradient
    let hidden_gradient = Algebra.map(hidden, this.activation_function.function_derivative);
    hidden_gradient.multiply(hidden_errors);
    hidden_gradient.multiply(this.learning_rate);

    // Calcuate input->hidden deltas
    let inputs_T = Algebra.transpose(inputs);
    let weight_hidden_input_deltas = Algebra.multiply(hidden_gradient, inputs_T);

    this.weights_hidden_input.add(weight_hidden_input_deltas);
    // Adjust the bias by its deltas (which is just the gradients)
    this.bias_h.add(hidden_gradient);
  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(data) {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }
    let nn = new NeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes);
    nn.weights_hidden_input = Algebra.deserialize(data.weights_hidden_input);
    nn.weights_hidden_output = Algebra.deserialize(data.weights_hidden_output);
    nn.bias_h = Algebra.deserialize(data.bias_h);
    nn.bias_o = Algebra.deserialize(data.bias_o);
    nn.learning_rate = data.learning_rate;
    return nn;
  }


  // Adding function for neuro-evolution
  copy() {
    return new NeuralNetwork(this);
  }

  // Accept an arbitrary function for mutation
  mutate(rate) {
    function mutate(val) {
      if(Math.random() < rate) {
        // return 2 * Math.random() - 1;
        return val + randomGaussian(0, 0.1);
      } else {
        return val;
      }
    }
    this.weights_hidden_input.map(mutate);
    this.weights_hidden_output.map(mutate);
    this.bias_h.map(mutate);
    this.bias_o.map(mutate);
  }



}
