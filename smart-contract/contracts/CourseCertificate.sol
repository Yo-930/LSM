// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CourseCertificate is ERC721, Ownable {

    uint256 public tokenCounter;

    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("Course Certificate", "CERT") Ownable(msg.sender){}

    function issueCertificate(
        address student,
        string memory _uri
    ) public onlyOwner {

        tokenCounter++;
        uint256 newTokenId = tokenCounter;

        _safeMint(student, newTokenId);
        _tokenURIs[newTokenId] = _uri;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        return _tokenURIs[tokenId];
    }

    // BLOCK TRANSFERS
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = super._update(to, tokenId, auth);

        // Allow minting (from = address(0))
        if (from != address(0)) {
            revert("Soulbound: Transfer not allowed");
        }

        return from;
    }
}

