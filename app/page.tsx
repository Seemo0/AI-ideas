"use client";
import{ useState } from "react";
import { Formik, Field } from "formik";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Spinner,
  Heading,
  Text,
  useColorModeValue,
  FormErrorMessage,
} from "@chakra-ui/react";

import { SelectControl } from "formik-chakra-ui";

export default function Home() {
  const [gratitude, setGratitude] = useState("");
  const [gratitudeLoading, setGratitudeLoading] = useState(false);
  const [gratitudeLoadingError, setGratitudeLoadingError] = useState(false);

  const initialValues = {
    category: "Language",
    lname: "",
    fname: "",
  };

  async function repeat(prompt: string) {
    setGratitude("");
    setGratitudeLoadingError(false);
    setGratitudeLoading(true);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGratitude((prev) => prev + chunkValue);
    }

    setGratitudeLoading(false);
  }

  async function handleSubmit(category: string, lname: string, fname: string) {
    const languagePrompt = `Generate a sentence talking about the best use cases for ${name} language.
                          In a similar format to, the ${lname} language is...`;

    const frameworkPrompt = `Generate a sentence talking about the best use cases for ${name} frameword.
                          In a similar format to, the ${fname} framework is...`;

    if (category == "Language") {
      try {
        repeat(languagePrompt);
      } catch (error) {
        console.error(error);
        setGratitudeLoadingError(true);
      } finally {
        setGratitudeLoading(false);
      }
    } else if (category == "Framework") {
      try {
        repeat(frameworkPrompt);
      } catch (error) {
        console.error(error);
        setGratitudeLoadingError(true);
      } finally {
        setGratitudeLoading(false);
      }
    }
  }

  return (
    <main>
      <Flex
        bg={useColorModeValue("gray.50", "gray.800")}
        color={useColorModeValue("gray.800", "gray.200")}
        align="center"
        justify="center"
        h="83vh"
      >
        <VStack spacing={4} align="center" textAlign={"center"}>
          <Box p={{ base: 2, md: 6 }}>
            <Heading
              fontWeight={700}
              fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
              lineHeight={"110%"}
            >
              Generate an idea about any
              <br />
              <Text as={"span"} color={"darkcyan"}>
                Language
              </Text>
              {" or "}
              <Text as={"span"} color={"blue.400"}>
                Frameword
              </Text>
            </Heading>
          </Box>

          <Box p={6} rounded="md" w={80} bg="white" color="black">
            <Formik
              initialValues={initialValues}
              onSubmit={(values, { resetForm }) => {
                handleSubmit(
                  values["category"],
                  values["lname"],
                  values["fname"]
                );

                resetForm();
              }}
              // validationSchema={validationSchema}
            >
              {({ handleSubmit, values, errors }) => (
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4} align="flex-start">
                    <FormControl isRequired>
                      <FormLabel htmlFor="category">Select an option</FormLabel>
                      <SelectControl name="category">
                        <option value="Language">Language</option>
                        <option value="Framework">Framework</option>
                      </SelectControl>
                      <FormErrorMessage>{errors.category}</FormErrorMessage>
                    </FormControl>
                    {values.category === "Language" && (
                      <>
                        <FormControl isRequired>
                          <FormLabel htmlFor="lname">
                            Type Language here.
                          </FormLabel>
                          <Field
                            as={Input}
                            id="lname"
                            name="lname"
                            type="name"
                            variant="filled"
                            bg="gray.200"
                          />
                          <FormErrorMessage>{errors.lname}</FormErrorMessage>
                        </FormControl>
                      </>
                    )}
                    {values.category === "Framework" && (
                      <>
                        <FormControl isRequired>
                          <FormLabel htmlFor="fname">
                            Type Framework here.
                          </FormLabel>
                          <Field
                            as={Input}
                            id="fname"
                            name="fname"
                            type="name"
                            variant="filled"
                            bg="gray.200"
                          />
                          <FormErrorMessage>{errors.fname}</FormErrorMessage>
                        </FormControl>
                      </>
                    )}
                    <Button type="submit" colorScheme="blue" width="full">
                      Generate Thought
                    </Button>
                  </VStack>
                </form>
              )}
            </Formik>
            {gratitudeLoading && (
              <Box py={4}>
                <Spinner />
              </Box>
            )}
            {gratitudeLoadingError && "Something went wrong. Please try again."}
          </Box>
          {gratitude && (
            <Box bg="white" p={6} rounded="md" w={80}>
              <Text fontWeight={700} color={"blackAlpha.900"}>
                {gratitude}
              </Text>
            </Box>
          )}
        </VStack>
      </Flex>
    </main>
  );
}
