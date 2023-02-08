

    function tree() {
      let bodyHeight = 400;
      let keyDef = d => d.id;
      let parentDef = d => d.parent;
      let nodeEnterFactory = () => {};
      let nodeMergeFactory = () => {};
      
      // Recursively append child nodes
      function nextLevel(selection, data) {
        if (!selection.select('.childlist').size()) {
          selection.append('ul')
            .classed('childlist', true)
            .style('list-style-type', 'none');
        }
        const items = selection.select('.childlist')
          .selectAll('li')
            .data(data, keyDef);
        items.exit().remove();
        items.enter()
          .append('li')
            .call(nodeEnterFactory)
          .merge(items)
            .each(function (d) {
              const node = d3.select(this);
              node.call(nodeMergeFactory, d);
              if (d.hasOwnProperty('children')) {
                node.call(nextLevel, d.children)
                  .select('.arrow')
                    .text('▼ ')
                    .on('click', function () {  // Collapse on click
                      const expanded = node.select('.childlist').style('display') !== 'none';
                      d3.select(this).text(expanded ? '▶ ' : '▼ ');
                      node.select('.childlist')
                          .style('display', expanded ? 'none' : 'inherit');
                    });
              } else {
                node.select('.childlist').remove();
              }
            });
      }
  
      function _tree(selection, records) {
        const root = d3.stratify()
            .id(keyDef)
            .parentId(parentDef)(records);
        // Tree body
        selection
            .style('overflow-y', 'scroll')
            .style('height', `${bodyHeight}px`);
        if (!selection.select('.body').size()) {
          selection.append('div').classed('body', true);
        }
        selection.select('.body')
            .style('transform', 'scale(1.5)')
            .style('transform-origin', 'top left')
            .call(nextLevel, root.children || []);
        selection.selectAll('.body > ul')
            .style('padding-left', 0);
        selection.selectAll('.body > ul > li')
            .classed('my-2', true);
      }
  
      _tree.bodyHeight = function (h) {
        bodyHeight = h;
        return _tree;
      };
  
      _tree.keyDef = function (f) {
        keyDef = f;
        return _tree;
      };
  
      _tree.nodeEnterFactory = function (f) {
        nodeEnterFactory = f;
        return _tree;
      };
  
      _tree.nodeMergeFactory = function (f) {
        nodeMergeFactory = f;
        return _tree;
      };
  
      return _tree;
    }
  
    // Return an array of ids that are checked
    function checkboxValues(selection) {
      return selection.select('.body')
         .selectAll('input:checked').data().map(d => d.id);
    }
  
    // Render tree node DOM with a checkbox
    function checkboxNode(selection) {
      selection.append('span').classed('arrow', true);
      selection.append('input')
          .attr('type', 'checkbox')
          .on('change', function () {
            d3.select('#selected')
              .text(checkboxValues(d3.select('#view')));
          });
      selection.append('span')
          .classed('label', true);
    }
  
    // Update node content
    function updateCheckbox(selection, record) {
      selection.select('.label')
          .text(record.id);
    }
  
    // Customize tree
    const t = tree().bodyHeight(500)
      .nodeEnterFactory(checkboxNode)
      .nodeMergeFactory(updateCheckbox);
    
    // Render a tree
    // If you want to update the data contents, call t again with new data.
    d3.select('#view').call(t, data);