package com.jonathan.pages;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.WebDriverWait;

public class BlogPage {
	WebDriver driver;
	WebDriverWait wait;
	
	public BlogPage(WebDriver driver)
	{
		this.driver = driver;
		PageFactory.initElements(this.driver, this);
		wait = new WebDriverWait(driver, 15);
	}

	
	// Elements
	@FindBy(how = How.XPATH, using = "//div[@class='grid-items']")
	WebElement articles;
	
	// Methods
	
	/**
	 * Validates the title in the page 
	 * @param expectedTitle The expected title
	 * @return
	 * A boolean true if the page's title corresponds to expectedTitle
	 */
	public boolean validTitle(String expectedTitle)
	{
		String actualTitle = driver.getTitle();
		if (actualTitle.equalsIgnoreCase(expectedTitle))
			return true;
		else
			return false;
	}
	
	/**
	 * This method is used to validate the number of articles in the blog's home page
	 * @param numOfArticles The expected number of articles
	 * @return A boolean true if the number of articles in the page corresponds to numOfArticles,
	 * false otherwise.
	 */
	public boolean hasEnoughArticles(int numOfArticles) {	
		List<WebElement> actualArticles = articles.findElements(By.className("item"));
		if (actualArticles.size() == numOfArticles)
			return true;
		else
			return false;
	}

}
