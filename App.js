import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';

import { ApolloProvider, Query } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import graphQL from 'graphql-tag';
import numeral from "numeral";

const client = new ApolloClient({
  uri: `https://w5xlvm3vzz.lp.gql.zone/graphql`
});

const ExchangeRateQuery = graphQL`
  query rates($currency: String!) {
    rates(currency: $currency) {
      currency
      rate
    }
  }
`;

export default class App extends Component {

  state = {
    currency: "USD"
  };
  
  render() {

    const { currency : currentCurrency } = this.state;

    return (
      <ApolloProvider client={client}>
        <View style={styles.container}>
          <Query query={ExchangeRateQuery} variables={{ currency: currentCurrency }}>
          {({ loading, error, data }) => {
            if (loading) return <ActivityIndicator color={'#287b97'} />;
            if (error) return <Text>{`Error: ${error}`}</Text>;
            console.log(data);
            // return (
            //   <View></View>
            // )
            return (
              <View style={styles.containerInside}>
                {data.rates
                  .filter(
                    ({ currency }) =>
                      currency !== currentCurrency &&
                      ["USD", "BTC", "LTC", "EUR", "JPY", "ETH"].includes(currency)
                  )
                  .map(({ currency, rate }, idx, rateArr) => (
                    <TouchableOpacity
                      accessibilityRole="button"
                      onPress={() => onCurrencyChange(currency)}
                      style={[
                        styles.currencyWrapper,
                        idx === rateArr.length - 1 && { borderBottomWidth: 0 }
                      ]}
                      key={currency}
                    >
                      <Text style={styles.currency}>{currency}</Text>
                      <Text style={styles.currency}>
                        {rate > 1 ? numeral(rate).format("0,0.00") : rate}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            );
          }}
          </Query>
        </View>
      </ApolloProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E3B4B',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },

  containerInside: {
    width: "100%",
    padding: 20
  },
  currencyWrapper: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: '#287b97'
  },
  currency: {
    // fontSize: fontSize.medium,
    fontWeight: "100",
    color: '#dee3e8',
    letterSpacing: 4
  }
});
