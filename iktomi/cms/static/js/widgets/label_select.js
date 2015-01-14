(function(){
  var LabelSelect = function(el) {
      this.element = el;
      this.multiple = this.element.dataset.multiple;
      this.element.getElements('input').addEvent('change', this.update.bind(this));
      this.update()
  }

  LabelSelect.prototype = {
    update: function(){
      var labels = this.element.getElements('label');
      for (var i=labels.length;i--;){
        var label = labels[i];
        var isOn = label.getElement('input').checked;
        label[isOn?'addClass':'removeClass']('selected');
      }
    }
  }

  Blocks.register('label-select', function(e){
    new LabelSelect(e);
  });
})();

Widgets.LabelSelect = Widgets.create(Widgets.Widget, {
    getValueAsList: function(){
        if (this.props.multiple) {
            return this.state.value;
        }
        var value = this.state.value +'';
        if (value) { return [value]; }
        return [];
    },
    onLabelClick: function(value){
        if (this.props.multiple){
            var index = this.state.value.indexOf(value);
            if (index == -1) {
              this.state.value.push(value);
            } else {
              this.state.value.splice(index, 1);
            }
            this.setValue(this.state.value);
        } else {
            this.setValue(value);
        }
    },
    render: function() {
        var widget = this.props;
        var values = this.getValueAsList();
        var inputs = [];
        for (var i=0; i<values.length; i++){
          inputs.push(<input type="hidden"
                             key={'input-'+values[i]}
                             name={widget.input_name}
                             value={values[i]}/>);
        }

        var labels = [];
        if (widget.null_label && !widget.multiple && ! widget.required) {
          var selected = values.length == 0;
          labels.push(<td key={'label-null'}>
                        <label className={"label-select__option" + (selected? " selected": '')}
                               onClick={this.onLabelClick.pass('')}>{widget.null_label}</label>
                      </td>);
        }
        for (var i=0; i<widget.options.length; i++){
          var option = widget.options[i];
          var selected = values.indexOf(option.value) != -1;
          if (widget.hiddens.indexOf(option.value) == -1 || selected) {
            labels.push(<td key={'label-'+option.value}>
                          <label className={"label-select__option" + (selected? " selected": '')}
                                 onClick={this.onLabelClick.pass(option.value)}>{option.title}</label>
                        </td>);
          }
        }

        return <div className="init-block label-select">
                 {inputs}
                 <table><tr>{labels}</tr></table>
               </div>;
    }
});
