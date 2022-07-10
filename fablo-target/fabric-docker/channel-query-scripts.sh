#!/usr/bin/env bash

source "$FABLO_NETWORK_ROOT/fabric-docker/scripts/channel-query-functions.sh"

set -eu

channelQuery() {
  echo "-> Channel query: " + "$@"

  if [ "$#" -eq 1 ]; then
    printChannelsHelp

  elif [ "$1" = "list" ] && [ "$2" = "registrar" ] && [ "$3" = "peer0" ]; then

    peerChannelListTls "cli.land.registrar.com" "peer0.land.registrar.com:7041" "crypto-orderer/tlsca.landreg.com-cert.pem"

  elif
    [ "$1" = "list" ] && [ "$2" = "realtor" ] && [ "$3" = "peer0" ]
  then

    peerChannelListTls "cli.land.realtor.com" "peer0.land.realtor.com:7061" "crypto-orderer/tlsca.landreg.com-cert.pem"

  elif
    [ "$1" = "list" ] && [ "$2" = "bank" ] && [ "$3" = "peer0" ]
  then

    peerChannelListTls "cli.land.bank.com" "peer0.land.bank.com:7081" "crypto-orderer/tlsca.landreg.com-cert.pem"

  elif
    [ "$1" = "list" ] && [ "$2" = "publicaccess" ] && [ "$3" = "peer0" ]
  then

    peerChannelListTls "cli.land.publicaccess.com" "peer0.land.publicaccess.com:7101" "crypto-orderer/tlsca.landreg.com-cert.pem"

  elif

    [ "$1" = "getinfo" ] && [ "$2" = "channel01" ] && [ "$3" = "registrar" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfoTls "channel01" "cli.land.registrar.com" "peer0.land.registrar.com:7041" "crypto-orderer/tlsca.landreg.com-cert.pem"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "channel01" ] && [ "$4" = "registrar" ] && [ "$5" = "peer0" ] && [ "$#" = 7 ]; then
    FILE_NAME=$6

    peerChannelFetchConfigTls "channel01" "cli.land.registrar.com" "${FILE_NAME}" "peer0.land.registrar.com:7041" "crypto-orderer/tlsca.landreg.com-cert.pem"

  elif [ "$1" = "fetch" ] && [ "$2" = "lastBlock" ] && [ "$3" = "channel01" ] && [ "$4" = "registrar" ] && [ "$5" = "peer0" ] && [ "$#" = 7 ]; then
    FILE_NAME=$6

    peerChannelFetchLastBlockTls "channel01" "cli.land.registrar.com" "${FILE_NAME}" "peer0.land.registrar.com:7041" "crypto-orderer/tlsca.landreg.com-cert.pem"

  elif [ "$1" = "fetch" ] && [ "$2" = "firstBlock" ] && [ "$3" = "channel01" ] && [ "$4" = "registrar" ] && [ "$5" = "peer0" ] && [ "$#" = 7 ]; then
    FILE_NAME=$6

    peerChannelFetchFirstBlockTls "channel01" "cli.land.registrar.com" "${FILE_NAME}" "peer0.land.registrar.com:7041" "crypto-orderer/tlsca.landreg.com-cert.pem"

  elif [ "$1" = "fetch" ] && [ "$2" = "block" ] && [ "$3" = "channel01" ] && [ "$4" = "registrar" ] && [ "$5" = "peer0" ] && [ "$#" = 8 ]; then
    FILE_NAME=$6
    BLOCK_NUMBER=$7

    peerChannelFetchBlockTls "channel01" "cli.land.registrar.com" "${FILE_NAME}" "${BLOCK_NUMBER}" "peer0.land.registrar.com:7041" "crypto-orderer/tlsca.landreg.com-cert.pem"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "channel01" ] && [ "$3" = "realtor" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfoTls "channel01" "cli.land.realtor.com" "peer0.land.realtor.com:7061" "crypto-orderer/tlsca.landreg.com-cert.pem"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "channel01" ] && [ "$4" = "realtor" ] && [ "$5" = "peer0" ] && [ "$#" = 7 ]; then
    FILE_NAME=$6

    peerChannelFetchConfigTls "channel01" "cli.land.realtor.com" "${FILE_NAME}" "peer0.land.realtor.com:7061" "crypto-orderer/tlsca.landreg.com-cert.pem"

  elif [ "$1" = "fetch" ] && [ "$2" = "lastBlock" ] && [ "$3" = "channel01" ] && [ "$4" = "realtor" ] && [ "$5" = "peer0" ] && [ "$#" = 7 ]; then
    FILE_NAME=$6

    peerChannelFetchLastBlockTls "channel01" "cli.land.realtor.com" "${FILE_NAME}" "peer0.land.realtor.com:7061" "crypto-orderer/tlsca.landreg.com-cert.pem"

  elif [ "$1" = "fetch" ] && [ "$2" = "firstBlock" ] && [ "$3" = "channel01" ] && [ "$4" = "realtor" ] && [ "$5" = "peer0" ] && [ "$#" = 7 ]; then
    FILE_NAME=$6

    peerChannelFetchFirstBlockTls "channel01" "cli.land.realtor.com" "${FILE_NAME}" "peer0.land.realtor.com:7061" "crypto-orderer/tlsca.landreg.com-cert.pem"

  elif [ "$1" = "fetch" ] && [ "$2" = "block" ] && [ "$3" = "channel01" ] && [ "$4" = "realtor" ] && [ "$5" = "peer0" ] && [ "$#" = 8 ]; then
    FILE_NAME=$6
    BLOCK_NUMBER=$7

    peerChannelFetchBlockTls "channel01" "cli.land.realtor.com" "${FILE_NAME}" "${BLOCK_NUMBER}" "peer0.land.realtor.com:7061" "crypto-orderer/tlsca.landreg.com-cert.pem"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "channel01" ] && [ "$3" = "bank" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfoTls "channel01" "cli.land.bank.com" "peer0.land.bank.com:7081" "crypto-orderer/tlsca.landreg.com-cert.pem"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "channel01" ] && [ "$4" = "bank" ] && [ "$5" = "peer0" ] && [ "$#" = 7 ]; then
    FILE_NAME=$6

    peerChannelFetchConfigTls "channel01" "cli.land.bank.com" "${FILE_NAME}" "peer0.land.bank.com:7081" "crypto-orderer/tlsca.landreg.com-cert.pem"

  elif [ "$1" = "fetch" ] && [ "$2" = "lastBlock" ] && [ "$3" = "channel01" ] && [ "$4" = "bank" ] && [ "$5" = "peer0" ] && [ "$#" = 7 ]; then
    FILE_NAME=$6

    peerChannelFetchLastBlockTls "channel01" "cli.land.bank.com" "${FILE_NAME}" "peer0.land.bank.com:7081" "crypto-orderer/tlsca.landreg.com-cert.pem"

  elif [ "$1" = "fetch" ] && [ "$2" = "firstBlock" ] && [ "$3" = "channel01" ] && [ "$4" = "bank" ] && [ "$5" = "peer0" ] && [ "$#" = 7 ]; then
    FILE_NAME=$6

    peerChannelFetchFirstBlockTls "channel01" "cli.land.bank.com" "${FILE_NAME}" "peer0.land.bank.com:7081" "crypto-orderer/tlsca.landreg.com-cert.pem"

  elif [ "$1" = "fetch" ] && [ "$2" = "block" ] && [ "$3" = "channel01" ] && [ "$4" = "bank" ] && [ "$5" = "peer0" ] && [ "$#" = 8 ]; then
    FILE_NAME=$6
    BLOCK_NUMBER=$7

    peerChannelFetchBlockTls "channel01" "cli.land.bank.com" "${FILE_NAME}" "${BLOCK_NUMBER}" "peer0.land.bank.com:7081" "crypto-orderer/tlsca.landreg.com-cert.pem"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "channel01" ] && [ "$3" = "publicaccess" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfoTls "channel01" "cli.land.publicaccess.com" "peer0.land.publicaccess.com:7101" "crypto-orderer/tlsca.landreg.com-cert.pem"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "channel01" ] && [ "$4" = "publicaccess" ] && [ "$5" = "peer0" ] && [ "$#" = 7 ]; then
    FILE_NAME=$6

    peerChannelFetchConfigTls "channel01" "cli.land.publicaccess.com" "${FILE_NAME}" "peer0.land.publicaccess.com:7101" "crypto-orderer/tlsca.landreg.com-cert.pem"

  elif [ "$1" = "fetch" ] && [ "$2" = "lastBlock" ] && [ "$3" = "channel01" ] && [ "$4" = "publicaccess" ] && [ "$5" = "peer0" ] && [ "$#" = 7 ]; then
    FILE_NAME=$6

    peerChannelFetchLastBlockTls "channel01" "cli.land.publicaccess.com" "${FILE_NAME}" "peer0.land.publicaccess.com:7101" "crypto-orderer/tlsca.landreg.com-cert.pem"

  elif [ "$1" = "fetch" ] && [ "$2" = "firstBlock" ] && [ "$3" = "channel01" ] && [ "$4" = "publicaccess" ] && [ "$5" = "peer0" ] && [ "$#" = 7 ]; then
    FILE_NAME=$6

    peerChannelFetchFirstBlockTls "channel01" "cli.land.publicaccess.com" "${FILE_NAME}" "peer0.land.publicaccess.com:7101" "crypto-orderer/tlsca.landreg.com-cert.pem"

  elif [ "$1" = "fetch" ] && [ "$2" = "block" ] && [ "$3" = "channel01" ] && [ "$4" = "publicaccess" ] && [ "$5" = "peer0" ] && [ "$#" = 8 ]; then
    FILE_NAME=$6
    BLOCK_NUMBER=$7

    peerChannelFetchBlockTls "channel01" "cli.land.publicaccess.com" "${FILE_NAME}" "${BLOCK_NUMBER}" "peer0.land.publicaccess.com:7101" "crypto-orderer/tlsca.landreg.com-cert.pem"

  else

    printChannelsHelp
  fi

}

printChannelsHelp() {
  echo "Channel management commands:"
  echo ""

  echo "fablo channel list registrar peer0"
  echo -e "\t List channels on 'peer0' of 'Registrar'".
  echo ""

  echo "fablo channel list realtor peer0"
  echo -e "\t List channels on 'peer0' of 'Realtor'".
  echo ""

  echo "fablo channel list bank peer0"
  echo -e "\t List channels on 'peer0' of 'Bank'".
  echo ""

  echo "fablo channel list publicaccess peer0"
  echo -e "\t List channels on 'peer0' of 'PublicAccess'".
  echo ""

  echo "fablo channel getinfo channel01 registrar peer0"
  echo -e "\t Get channel info on 'peer0' of 'Registrar'".
  echo ""
  echo "fablo channel fetch config channel01 registrar peer0 <fileName.json>"
  echo -e "\t Download latest config block to current dir. Uses first peer 'peer0' of 'Registrar'".
  echo ""
  echo "fablo channel fetch lastBlock channel01 registrar peer0 <fileName.json>"
  echo -e "\t Download last, decrypted block to current dir. Uses first peer 'peer0' of 'Registrar'".
  echo ""
  echo "fablo channel fetch firstBlock channel01 registrar peer0 <fileName.json>"
  echo -e "\t Download first, decrypted block to current dir. Uses first peer 'peer0' of 'Registrar'".
  echo ""

  echo "fablo channel getinfo channel01 realtor peer0"
  echo -e "\t Get channel info on 'peer0' of 'Realtor'".
  echo ""
  echo "fablo channel fetch config channel01 realtor peer0 <fileName.json>"
  echo -e "\t Download latest config block to current dir. Uses first peer 'peer0' of 'Realtor'".
  echo ""
  echo "fablo channel fetch lastBlock channel01 realtor peer0 <fileName.json>"
  echo -e "\t Download last, decrypted block to current dir. Uses first peer 'peer0' of 'Realtor'".
  echo ""
  echo "fablo channel fetch firstBlock channel01 realtor peer0 <fileName.json>"
  echo -e "\t Download first, decrypted block to current dir. Uses first peer 'peer0' of 'Realtor'".
  echo ""

  echo "fablo channel getinfo channel01 bank peer0"
  echo -e "\t Get channel info on 'peer0' of 'Bank'".
  echo ""
  echo "fablo channel fetch config channel01 bank peer0 <fileName.json>"
  echo -e "\t Download latest config block to current dir. Uses first peer 'peer0' of 'Bank'".
  echo ""
  echo "fablo channel fetch lastBlock channel01 bank peer0 <fileName.json>"
  echo -e "\t Download last, decrypted block to current dir. Uses first peer 'peer0' of 'Bank'".
  echo ""
  echo "fablo channel fetch firstBlock channel01 bank peer0 <fileName.json>"
  echo -e "\t Download first, decrypted block to current dir. Uses first peer 'peer0' of 'Bank'".
  echo ""

  echo "fablo channel getinfo channel01 publicaccess peer0"
  echo -e "\t Get channel info on 'peer0' of 'PublicAccess'".
  echo ""
  echo "fablo channel fetch config channel01 publicaccess peer0 <fileName.json>"
  echo -e "\t Download latest config block to current dir. Uses first peer 'peer0' of 'PublicAccess'".
  echo ""
  echo "fablo channel fetch lastBlock channel01 publicaccess peer0 <fileName.json>"
  echo -e "\t Download last, decrypted block to current dir. Uses first peer 'peer0' of 'PublicAccess'".
  echo ""
  echo "fablo channel fetch firstBlock channel01 publicaccess peer0 <fileName.json>"
  echo -e "\t Download first, decrypted block to current dir. Uses first peer 'peer0' of 'PublicAccess'".
  echo ""

}
