import { ethers } from "hardhat";

async function main() {

    const Contract = await ethers.getContractFactory("CourseCertificate");
    const contract = await Contract.deploy();

    await contract.waitForDeployment();

    console.log("Contract Deployed at:",await contract.getAddress());
    
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
    
});