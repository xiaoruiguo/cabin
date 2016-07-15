/*
  Copyright 2015 Skippbox, Ltd

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import Colors from 'styles/Colors';
import ListItem from 'components/commons/ListItem';
import ListHeader from 'components/commons/ListHeader';
import LabelsView from 'components/commons/LabelsView';
import ScrollView from 'components/commons/ScrollView';
import NodesActions from 'actions/NodesActions';

const {
  View,
  StyleSheet,
} = ReactNative;

const { PropTypes } = React;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  list: {
    flex: 1,
    paddingTop: 20,
  },
  section: {
    marginBottom: 20,
  },
});

export default class NodesShow extends Component {

  static propTypes = {
    node: PropTypes.instanceOf(Immutable.Map),
    cluster: PropTypes.instanceOf(Immutable.Map),
  }

  render() {
    const { node } = this.props;
    const conditionReady = node.getIn(['status', 'conditions']).find(c => c.get('type') === 'Ready');
    const ready = conditionReady ? conditionReady.get('status') === 'True' : false;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.list} onRefresh={this.handleRefresh.bind(this)}>
          <View style={styles.section}>
            <ListHeader title=""/>
            <ListItem title="Name" detailTitle={node.getIn(['metadata', 'name'])}/>
            <ListItem title="Namespace" detailTitle={node.getIn(['metadata', 'namespace'])}/>
            <ListItem title="Age" detailTitle={intlrd(node.getIn(['metadata', 'creationTimestamp']))}/>
            <ListItem title="Status" detailTitle={ready ? 'Ready' : 'Not Ready'} isLast={true}/>
          </View>
          <View style={styles.section}>
            <LabelsView entity={node} onSubmit={this.handleLabelSubmit.bind(this)} onDelete={this.handleLabelDelete.bind(this)} />
          </View>
          <View style={styles.section}>
            <ListHeader title="Addresses"/>
            {this.renderAddresses()}
          </View>
        </ScrollView>
      </View>
    );
  }

  renderAddresses() {
    const addresses = this.props.node.getIn(['status', 'addresses']);
    const items = addresses.map((address, i) => {
      return <ListItem key={i} isLast={i === addresses.size - 1} title={address.get('address')} detailTitle={address.get('type')}/>;
    });
    return items;
  }

  handleRefresh() {
    NodesActions.fetchNodes(this.props.cluster);
  }

  handleLabelSubmit({key, value}) {
    return NodesActions.addNodeLabel({node: this.props.node, cluster: this.props.cluster, key, value});
  }

  handleLabelDelete(key) {
    return NodesActions.deleteNodeLabel({node: this.props.node, cluster: this.props.cluster, key});
  }
}