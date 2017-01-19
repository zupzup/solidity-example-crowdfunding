FROM ubuntu:trusty

ARG VERSION=0.4.6

LABEL name="solc" version=$VERSION

RUN apt-get -qq update \
  && apt-get -qq -y install libboost-filesystem1.54-dev libboost-program-options1.54-dev libjsoncpp-dev wget zip \
  && wget -q https://github.com/ethereum/solidity/releases/download/v${VERSION}/solidity-ubuntu-trusty.zip \
  && unzip solidity-ubuntu-trusty.zip \
  && sudo mv libsoldevcore.so libsolevmasm.so libsolidity.so /usr/lib \
  && sudo mv lllc solc /usr/bin 

COPY build.sh build.sh 

RUN mkdir /sol

RUN chmod u+x build.sh

ENTRYPOINT ["/build.sh"]
