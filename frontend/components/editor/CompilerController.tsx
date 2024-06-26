import {
	Box,
	Button,
	Center,
	Flex,
	FormControl,
	FormLabel,
	Select,
	Input,
	Text,
	SimpleGrid,
} from "@chakra-ui/react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
} from "@chakra-ui/react";

import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { API, ServerApi } from "../../utils/constants";
import { Editor } from "./EditorComponent";
import { useClipboard } from "@chakra-ui/react";
import { SOCKET_IO } from "../../utils/constants";
import { useDebouncedEffect } from "../../utils/useDebounceEffect";
import { SERVER_URL } from "../../utils/constants";
import { useAuth0 } from "@auth0/auth0-react";
import Router from "next/router";
import { WhatsappIcon } from "react-share";
import { useDisclosure } from "@chakra-ui/react";

const languages = [
	"c",
	"cpp",
	"javascript",
	"java",
	"kotlin",
	"python",
	"python3",
	"scala",
	"swift",
	"csharp",
	"go",
	"haskell",
	"erlang",
	"perl",
	"ruby",
	"php",
	"bash",
	"r",
	"coffeescript",
	"mysql",
	"typescript",
];

const themes = [
	"monokai",
	"github",
	"tomorrow",
	"kuroir",
	"twilight",
	"xcode",
	"textmate",
	"solarized_dark",
	"solarized_light",
	"terminal",
];

const fontSizes = [
	"8",
	"10",
	"12",
	"14",
	"16",
	"18",
	"20",
	"22",
	"24",
	"26",
	"28",
	"30",
	"32",
	"40",
	"45",
];

export default function CompilerCnntroller({ roomId }): JSX.Element {
	const { user } = useAuth0();
	// states

	const [number, setnumber] = useState("");
	const [language, setLanguage] = useState<string>("python");
	const [theme, setTheme] = useState<string>("monokai");
	const [fontSize, setFontSize] = useState<string>("20");
	const [code, setCode] = useState<String>("");
	const [input, setInput] = useState<String>("");
	const [output, setOutput] = useState<String>("");

	const [statusId, setStatusId] = useState<String>("");
	const [status, setStatus] = useState<String>("idel");
	const [isRunning, setIsRunning] = useState<boolean>(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [data, setData] = useState({
		time: "0.00",
		result: "idel",
	});

	let url = "";
	if (typeof window !== "undefined") {
		url = location.href;
	}

	const { hasCopied, onCopy } = useClipboard(url);

	const router = useRouter();
	const { id } = router.query;

	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => {
		console.log("df");
		setShow(true);
	};

	useEffect(() => {}, [show]);

	useEffect(() => {
		if (typeof window !== undefined) {
			const getCode = async () => {
				const url = SERVER_URL + "/code/" + roomId;
				console.log(url);
				const res = await axios.get(url);
				setCode(res.data.code);
			};
			getCode();
		}
	}, []);

	const onShare = () => {
		ServerApi.post("/api/shareCode", { phone: number, code: code });
	};

	const onLeave = () => {
		ServerApi.post("/api/room/exitRoom", { email: user.email, roomId: id });
		Router.push("/");
	};

	// Run Program
	const getOutput = async (statusId: string | String) => {
		if (statusId == "") return;
		try {
			let response = await API.get(`/get_details?id=${statusId}&api_key=guest`);
			console.log(response);
			const { stdout, stderr, build_stderr } = response.data;
			let newOutput = "";
			if (stdout) newOutput += stdout;
			if (stderr) newOutput += stderr;
			if (build_stderr) newOutput += build_stderr;
			setOutput(newOutput);
			SOCKET_IO.emit("output", newOutput, id);
			setData({ time: response.data.time, result: response.data.result });
			if (response.data.status != "completed") {
				await getOutput(statusId);
			}

			setStatus("completed");
			setIsRunning(false);
			setStatusId("");
		} catch (err) {
			setIsRunning(false);
			console.log(err);
		}
	};

	useEffect(() => {
		async function get_details() {
			await getOutput(statusId);
		}
		get_details();
	}, [statusId]);

	const onRun = async () => {
		setIsRunning(true);
		console.log(code);
		try {
			const data = {
				code: code,
				roomId: id,
			};
			await axios.post(SERVER_URL + "/code", data);
			let response = await API.post("/create", {
				source_code: code,
				language: language,
				api_key: "guest",
				input,
			});
			setStatusId(response.data.id);
			setStatus(response.data.status);
		} catch (err) {
			setIsRunning(false);
			console.log(err);
		}
	};

	useEffect(() => {
		SOCKET_IO.on("editor", (msg: string, roomId: string) => {
			setCode(msg);
		});
	});

	useEffect(() => {
		SOCKET_IO.on("input", (msg: string, roomId: string) => {
			setInput(msg);
		});
	});

	useEffect(() => {
		SOCKET_IO.on("language", (msg: string, roomId: string) => {
			setLanguage(msg);
		});
	});
	
	const onChangeEditor = (e) => {
		SOCKET_IO.emit("editor", e, id);
	};

	useEffect(() => {
		//console.log(output);
		SOCKET_IO.on("output", (msg: string, roomId: string) => {
			setOutput(msg);
		});
	}, [output]);

	useDebouncedEffect(
		async () => {
			const data = {
				code: code,
				roomId: id,
			};
			const res = await axios.post(SERVER_URL + "/code", data);
		},
		[code],
		5000
	);

	return (
		<>
			{/* Editor's Navbar- Controls */}

			<SimpleGrid
				minChildWidth="120px"
				style={{ padding: "30px" }}
				spacing="40px">
				<FormControl>
					<Center>
						<FormLabel my="0">Choose Language</FormLabel>
					</Center>
					<Select
						defaultValue={language}
						name="mode"
						value={language}
						onChange={(e) => {
							SOCKET_IO.emit("language", e.target.value, id);
							setLanguage(e.target.value);
						}}>
						{languages.map((lang, index) => {
							return (
								<option key={index} value={lang}>
									{lang}
								</option>
							);
						})}
					</Select>
				</FormControl>
				<FormControl>
					<Center>
						<FormLabel my="0">Choose Theme</FormLabel>
					</Center>
					<Select
						defaultValue={theme}
						name="theme"
						onChange={(e) => setTheme(e.target.value)}>
						{themes.map((th) => (
							<option key={th} value={th}>
								{th}
							</option>
						))}
					</Select>
				</FormControl>
				<FormControl>
					<Center>
						<FormLabel my="0">Font Size</FormLabel>
					</Center>
					<Select
						defaultValue={fontSize}
						name="fontSize"
						onChange={(e) => setFontSize(e.target.value)}>
						{fontSizes.map((fSize, index) => {
							return (
								<option key={index} value={fSize}>
									{fSize}
								</option>
							);
						})}
					</Select>
				</FormControl>

				<Button
					colorScheme="teal"
					variant="solid"
					isLoading={isRunning}
					loadingText="Running..."
					onClick={onRun}>
					Save and Run
				</Button>

				<Button colorScheme="teal" variant="solid" onClick={onCopy}>
					Copy RoomInfo
				</Button>

				<Button colorScheme="red" variant="solid" onClick={onLeave}>
					Leave Room
				</Button>

				<WhatsappIcon onClick={onOpen} size={42} round={true} />

				<Modal isOpen={isOpen} onClose={onClose}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Modal Title</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							{" "}
							<FormControl mt={6}>
								<FormLabel>Whatsapp Number</FormLabel>
								<Input
									type="string"
									value={number}
									onChange={(e) => {
										setnumber(e.target.value);
									}}
									placeholder="Enter whatsapp number"
									_placeholder={{ color: "gray.500" }}
								/>
							</FormControl>
						</ModalBody>

						<ModalFooter>
							<Button colorScheme="blue" mr={3} onClick={onClose}>
								Close
							</Button>
							<Button variant="ghost" onClick={onShare}>
								Share
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			</SimpleGrid>

			<hr />

			{/* Editor with Input and Output section */}
			<div>
				<Center>
					<Flex>
						<Box p={4}>
							<Text>Code</Text>
							<Editor
								mode={language}
								language={language}
								theme={theme}
								value={code} // ! Bug: python -> after enter editor it is not indented by default
								onChange={(e) => {
									onChangeEditor(e);
									// setCode(e);
									// SOCKET_IO.emit("editor", code);
								}}
								height={"69vh"}
								width={"40vw"}
								fontSize={parseInt(fontSize, 10)}
								setOptions={{
									enableBasicAutocompletion: true,
									enableLiveAutocompletion: true,
									enableSnippets: true,
									showLineNumbers: true,
									tabSize: 2,
								}}
								commands={[
									{
										name: "run",
										bindKey: {
											win: "Ctrl-enter",
											mac: "Cmd-enter",
										},
										exec: onRun,
									},
								]}
							/>
						</Box>
						<Box p={8}>
							<Box mb={4}>
								<Text>Input</Text>
								<Editor
									language=""
									theme={theme}
									value={input}
									//   fontSize={fontSize}
									onChange={(e) => {
										setInput(e);
										SOCKET_IO.emit("input", e, id);
									}}
									height={"32vh"}
									width={"28vw"}
									fontSize={parseInt(fontSize, 10)}
								/>
							</Box>
							<Box>
								<Text>
									<pre>
										Output Time(sec):{data.time} Result:{data.result}
									</pre>
								</Text>
								<Editor
									language=""
									theme={theme}
									value={output}
									// fontSize={fontSize}
									onChange={(e) => setOutput(e)}
									height={"32vh"}
									width={"28vw"}
									fontSize={parseInt(fontSize, 10)}
								/>
							</Box>
						</Box>
					</Flex>
				</Center>
			</div>
		</>
	);
}
